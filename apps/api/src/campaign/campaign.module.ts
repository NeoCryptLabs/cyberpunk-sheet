import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignService } from './campaign.service';
import { CampaignResolver } from './campaign.resolver';
import { Campaign, CampaignSchema } from './entities/campaign.entity';
import { Character, CharacterSchema } from '../character/entities/character.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  providers: [CampaignService, CampaignResolver],
  exports: [CampaignService],
})
export class CampaignModule {}
