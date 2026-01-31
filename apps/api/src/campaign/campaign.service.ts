import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Campaign, CampaignDocument, JournalEntry, JournalEntryType } from './entities/campaign.entity';
import {
  CreateCampaignInput,
  UpdateCampaignInput,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
} from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>) {}

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
}
