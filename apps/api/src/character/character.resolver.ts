import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CharacterService } from './character.service';
import { Character } from './entities/character.entity';
import { CreateCharacterInput, UpdateCharacterInput } from './dto/character.dto';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => Character)
@UseGuards(GqlAuthGuard)
export class CharacterResolver {
  constructor(private characterService: CharacterService) {}

  @Mutation(() => Character)
  async createCharacter(
    @CurrentUser() user: User,
    @Args('input') input: CreateCharacterInput
  ): Promise<Character> {
    return this.characterService.create(user._id, input);
  }

  @Query(() => [Character])
  async myCharacters(@CurrentUser() user: User): Promise<Character[]> {
    return this.characterService.findAllByUser(user._id);
  }

  @Query(() => Character)
  async character(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<Character> {
    return this.characterService.findOne(id, user._id);
  }

  @Mutation(() => Character)
  async updateCharacter(
    @CurrentUser() user: User,
    @Args('input') input: UpdateCharacterInput
  ): Promise<Character> {
    return this.characterService.update(user._id, input);
  }

  @Mutation(() => Boolean)
  async deleteCharacter(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<boolean> {
    return this.characterService.delete(id, user._id);
  }

  @Mutation(() => Character)
  async takeDamage(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('damage', { type: () => Int }) damage: number
  ): Promise<Character> {
    return this.characterService.updateHitPoints(id, user._id, damage);
  }

  @Mutation(() => Character)
  async healCharacter(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('amount', { type: () => Int }) amount: number
  ): Promise<Character> {
    return this.characterService.healCharacter(id, user._id, amount);
  }

  @Mutation(() => Character)
  async spendLuck(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('amount', { type: () => Int }) amount: number
  ): Promise<Character> {
    return this.characterService.spendLuck(id, user._id, amount);
  }

  @Mutation(() => Character)
  async restoreLuck(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<Character> {
    return this.characterService.restoreLuck(id, user._id);
  }
}
