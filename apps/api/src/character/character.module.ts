import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CharacterService } from './character.service';
import { CharacterResolver } from './character.resolver';
import { Character, CharacterSchema } from './entities/character.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Character.name, schema: CharacterSchema }])],
  providers: [CharacterService, CharacterResolver],
  exports: [CharacterService],
})
export class CharacterModule {}
