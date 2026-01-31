import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Character, CharacterDocument } from './entities/character.entity';
import { CreateCharacterInput, UpdateCharacterInput } from './dto/character.dto';
import { ALL_SKILLS } from './data/cyberpunk-red.data';

@Injectable()
export class CharacterService {
  constructor(@InjectModel(Character.name) private characterModel: Model<CharacterDocument>) {}

  async create(userId: string, input: CreateCharacterInput): Promise<Character> {
    // Initialize default skills if not provided
    const skills = input.skills ?? ALL_SKILLS.map((s) => ({ ...s, level: 0 }));

    // Calculate derived stats
    const maxHitPoints = this.calculateMaxHp(input.stats.body, input.stats.willpower);
    const seriouslyWoundedThreshold = Math.ceil(maxHitPoints / 2);
    const deathSave = input.stats.body;
    const cyberwareLoss = input.cyberware?.reduce((sum, c) => sum + c.humanityLoss, 0) ?? 0;
    const humanity = input.stats.empathy * 10 - cyberwareLoss;

    const character = new this.characterModel({
      ...input,
      userId,
      skills,
      maxHitPoints,
      currentHitPoints: maxHitPoints,
      seriouslyWoundedThreshold,
      deathSave,
      humanity,
      currentLuck: input.stats.luck,
    });

    return character.save();
  }

  async findAllByUser(userId: string): Promise<Character[]> {
    return this.characterModel.find({ userId }).sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Character> {
    const character = await this.characterModel.findById(id).exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    if (character.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You do not have access to this character');
    }

    return character;
  }

  async update(userId: string, input: UpdateCharacterInput): Promise<Character> {
    const { id, ...updateData } = input;

    const character = await this.characterModel.findById(id).exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    if (character.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You do not have access to this character');
    }

    // Recalculate derived stats if stats or cyberware changed
    const stats = updateData.stats ?? character.stats;
    const cyberware = updateData.cyberware ?? character.cyberware ?? [];

    const maxHitPoints = this.calculateMaxHp(stats.body, stats.willpower);
    const seriouslyWoundedThreshold = Math.ceil(maxHitPoints / 2);
    const deathSave = stats.body;
    const cyberwareLoss = cyberware.reduce((sum, c) => sum + c.humanityLoss, 0);
    const humanity = stats.empathy * 10 - cyberwareLoss;

    const updated = await this.characterModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateData,
            maxHitPoints,
            seriouslyWoundedThreshold,
            deathSave,
            humanity,
          },
        },
        { new: true }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Character with ID ${id} not found after update`);
    }

    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const character = await this.characterModel.findById(id).exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    if (character.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You do not have access to this character');
    }

    await this.characterModel.findByIdAndDelete(id).exec();
    return true;
  }

  async updateHitPoints(id: string, userId: string, damage: number): Promise<Character> {
    const character = await this.findOne(id, userId);
    const newHp = Math.max(0, character.currentHitPoints - damage);

    const updated = await this.characterModel
      .findByIdAndUpdate(id, { $set: { currentHitPoints: newHp } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Character with ID ${id} not found after update`);
    }

    return updated;
  }

  async healCharacter(id: string, userId: string, amount: number): Promise<Character> {
    const character = await this.findOne(id, userId);
    const maxHp = this.calculateMaxHp(character.stats.body, character.stats.willpower);
    const newHp = Math.min(maxHp, character.currentHitPoints + amount);

    const updated = await this.characterModel
      .findByIdAndUpdate(id, { $set: { currentHitPoints: newHp } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Character with ID ${id} not found after update`);
    }

    return updated;
  }

  async spendLuck(id: string, userId: string, amount: number): Promise<Character> {
    const character = await this.findOne(id, userId);

    if (character.currentLuck < amount) {
      throw new ForbiddenException('Not enough luck points');
    }

    const updated = await this.characterModel
      .findByIdAndUpdate(id, { $inc: { currentLuck: -amount } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Character with ID ${id} not found after update`);
    }

    return updated;
  }

  async restoreLuck(id: string, userId: string): Promise<Character> {
    const character = await this.findOne(id, userId);

    const updated = await this.characterModel
      .findByIdAndUpdate(id, { $set: { currentLuck: character.stats.luck } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Character with ID ${id} not found after update`);
    }

    return updated;
  }

  private calculateMaxHp(body: number, willpower: number): number {
    return 10 + 5 * Math.ceil((body + willpower) / 2);
  }
}
