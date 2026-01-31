import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';

import { Campaign, CampaignDocument, JournalEntry, JournalEntryType } from './entities/campaign.entity';
import {
  CreateCampaignInput,
  UpdateCampaignInput,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
} from './dto/campaign.dto';
import { Character, CharacterDocument } from '../character/entities/character.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Character.name) private characterModel: Model<CharacterDocument>,
  ) {}

  async create(gameMasterId: string, input: CreateCampaignInput): Promise<Campaign> {
    const campaign = new this.campaignModel({
      ...input,
      gameMasterId,
    });
    return campaign.save();
  }

  async findAllByUser(userId: string): Promise<Campaign[]> {
    return this.campaignModel
      .find({
        $or: [{ gameMasterId: userId }, { playerIds: userId }],
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    const isParticipant =
      campaign.gameMasterId.toString() === userId.toString() ||
      campaign.playerIds.map((p) => p.toString()).includes(userId.toString());

    if (!isParticipant) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    return campaign;
  }

  async update(userId: string, input: UpdateCampaignInput): Promise<Campaign> {
    const { id, ...updateData } = input;
    const campaign = await this.campaignModel.findById(id).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.gameMasterId.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the Game Master can update the campaign');
    }

    const updated = await this.campaignModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Campaign with ID ${id} not found after update`);
    }

    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const campaign = await this.campaignModel.findById(id).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.gameMasterId.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the Game Master can delete the campaign');
    }

    await this.campaignModel.findByIdAndDelete(id).exec();
    return true;
  }

  // Journal Entry methods
  async addJournalEntry(userId: string, input: CreateJournalEntryInput): Promise<Campaign> {
    const { campaignId, ...entryData } = input;
    const campaign = await this.findOne(campaignId, userId);

    const newEntry = {
      _id: new Types.ObjectId().toString(),
      ...entryData,
      tags: entryData.tags ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JournalEntry;

    const updated = await this.campaignModel
      .findByIdAndUpdate(campaignId, { $push: { journalEntries: newEntry } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found after update`);
    }

    return updated;
  }

  async updateJournalEntry(userId: string, input: UpdateJournalEntryInput): Promise<Campaign> {
    const { campaignId, entryId, ...updateData } = input;

    if (!campaignId) {
      throw new NotFoundException('Campaign ID is required');
    }

    const campaign = await this.findOne(campaignId, userId);

    const entryIndex = campaign.journalEntries.findIndex((e) => e._id.toString() === entryId);

    if (entryIndex === -1) {
      throw new NotFoundException(`Journal entry with ID ${entryId} not found`);
    }

    const updateFields: Record<string, unknown> = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields[`journalEntries.${entryIndex}.${key}`] = value;
      }
    });
    updateFields[`journalEntries.${entryIndex}.updatedAt`] = new Date();

    const updated = await this.campaignModel
      .findByIdAndUpdate(campaignId, { $set: updateFields }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found after update`);
    }

    return updated;
  }

  async deleteJournalEntry(campaignId: string, entryId: string, userId: string): Promise<Campaign> {
    await this.findOne(campaignId, userId);

    const updated = await this.campaignModel
      .findByIdAndUpdate(campaignId, { $pull: { journalEntries: { _id: entryId } } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found after update`);
    }

    return updated;
  }

  async getJournalEntriesByType(
    campaignId: string,
    userId: string,
    type: JournalEntryType
  ): Promise<JournalEntry[]> {
    const campaign = await this.findOne(campaignId, userId);
    return campaign.journalEntries.filter((e) => e.type === type);
  }

  async searchJournalEntries(campaignId: string, userId: string, query: string): Promise<JournalEntry[]> {
    const campaign = await this.findOne(campaignId, userId);
    const lowerQuery = query.toLowerCase();

    return campaign.journalEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.content.toLowerCase().includes(lowerQuery) ||
        e.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  }

  // ============================================
  // PLAYER MANAGEMENT METHODS
  // ============================================

  /**
   * Generate a 6-character invite code for a campaign (GM only)
   * Code expires after 24 hours
   */
  async generateInviteCode(campaignId: string, userId: string): Promise<string> {
    const campaign = await this.campaignModel.findById(campaignId).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    if (campaign.gameMasterId.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the Game Master can generate invite codes');
    }

    // Generate 6-character alphanumeric code
    const inviteCode = randomBytes(3).toString('hex').toUpperCase();
    const inviteCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.campaignModel.findByIdAndUpdate(campaignId, {
      $set: { inviteCode, inviteCodeExpiry },
    });

    return inviteCode;
  }

  /**
   * Join a campaign using an invite code
   */
  async joinCampaign(inviteCode: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOne({
        inviteCode: inviteCode.toUpperCase(),
        inviteCodeExpiry: { $gt: new Date() },
      })
      .exec();

    if (!campaign) {
      throw new BadRequestException('Invalid or expired invite code');
    }

    // Check if user is already a player
    if (campaign.playerIds.map((p) => p.toString()).includes(userId.toString())) {
      throw new BadRequestException('You are already a member of this campaign');
    }

    // Check if user is the GM
    if (campaign.gameMasterId.toString() === userId.toString()) {
      throw new BadRequestException('You are the Game Master of this campaign');
    }

    // Add user to playerIds and clear the invite code (single use)
    const updated = await this.campaignModel
      .findByIdAndUpdate(
        campaign._id,
        {
          $addToSet: { playerIds: userId },
          $unset: { inviteCode: 1, inviteCodeExpiry: 1 },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Campaign not found after update');
    }

    return updated;
  }

  /**
   * Remove a player from a campaign (GM only)
   */
  async removePlayer(campaignId: string, playerUserId: string, requesterId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(campaignId).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    if (campaign.gameMasterId.toString() !== requesterId.toString()) {
      throw new ForbiddenException('Only the Game Master can remove players');
    }

    // Also remove any characters from this player that are linked to the campaign
    const playerCharacters = await this.characterModel
      .find({ userId: playerUserId })
      .select('_id')
      .exec();
    const playerCharacterIds = playerCharacters.map((c) => c._id.toString());

    const updated = await this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        {
          $pull: {
            playerIds: playerUserId,
            characterIds: { $in: playerCharacterIds },
          },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Campaign not found after update');
    }

    return updated;
  }

  /**
   * Link a character to a campaign (character owner only)
   */
  async linkCharacter(campaignId: string, characterId: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(campaignId).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    // Check if user is a participant
    const isParticipant =
      campaign.gameMasterId.toString() === userId.toString() ||
      campaign.playerIds.map((p) => p.toString()).includes(userId.toString());

    if (!isParticipant) {
      throw new ForbiddenException('You must be a member of the campaign to link a character');
    }

    // Verify the character belongs to the user
    const character = await this.characterModel.findById(characterId).exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    if (character.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only link your own characters');
    }

    // Check if character is already linked
    if (campaign.characterIds.map((c) => c.toString()).includes(characterId)) {
      throw new BadRequestException('Character is already linked to this campaign');
    }

    const updated = await this.campaignModel
      .findByIdAndUpdate(campaignId, { $addToSet: { characterIds: characterId } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Campaign not found after update');
    }

    return updated;
  }

  /**
   * Unlink a character from a campaign (character owner only)
   */
  async unlinkCharacter(campaignId: string, characterId: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(campaignId).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    // Verify the character belongs to the user
    const character = await this.characterModel.findById(characterId).exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    if (character.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only unlink your own characters');
    }

    const updated = await this.campaignModel
      .findByIdAndUpdate(campaignId, { $pull: { characterIds: characterId } }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Campaign not found after update');
    }

    return updated;
  }

  /**
   * Get all characters linked to a campaign (GM only - for viewing player sheets)
   */
  async getCampaignCharacters(campaignId: string, userId: string): Promise<Character[]> {
    const campaign = await this.campaignModel.findById(campaignId).exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    if (campaign.gameMasterId.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the Game Master can view all campaign characters');
    }

    if (campaign.characterIds.length === 0) {
      return [];
    }

    return this.characterModel.find({ _id: { $in: campaign.characterIds } }).exec();
  }
}
