import { gql } from 'graphql-tag';

export const CHARACTER_FRAGMENT = gql`
  fragment CharacterFields on Character {
    _id
    userId
    handle
    realName
    role
    level
    stats {
      intelligence
      reflexes
      dexterity
      technology
      cool
      willpower
      luck
      move
      body
      empathy
    }
    maxHitPoints
    currentHitPoints
    seriouslyWoundedThreshold
    deathSave
    humanity
    roleAbility {
      name
      rank
      description
      specializations
    }
    skills {
      name
      linkedStat
      level
      ipSpent
    }
    cyberware {
      name
      type
      installation
      description
      humanityLoss
      cost
      optionSlots
      foundational
    }
    weapons {
      name
      type
      damage
      rof
      magazine
      skill
      handsRequired
      concealable
    }
    armor {
      name
      type
      stoppingPower
      penalty
    }
    inventory {
      name
      description
      quantity
      cost
      category
    }
    eurodollars
    lifepath {
      culturalOrigin
      personality
      clothingStyle
      hairstyle
      valueMost
      feelingsAboutPeople
      valuedPerson
      valuedPossession
      familyBackground
      childhoodEnvironment
      familyCrisis
      lifeGoals
      friends
      enemies
      romanticInvolvements
    }
    improvementPoints
    currentLuck
    notes
    portraitUrl
    createdAt
    updatedAt
  }
`;

export const MY_CHARACTERS_QUERY = gql`
  ${CHARACTER_FRAGMENT}
  query MyCharacters {
    myCharacters {
      ...CharacterFields
    }
  }
`;

export const CHARACTER_QUERY = gql`
  ${CHARACTER_FRAGMENT}
  query Character($id: ID!) {
    character(id: $id) {
      ...CharacterFields
    }
  }
`;

export const CREATE_CHARACTER_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation CreateCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      ...CharacterFields
    }
  }
`;

export const UPDATE_CHARACTER_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation UpdateCharacter($input: UpdateCharacterInput!) {
    updateCharacter(input: $input) {
      ...CharacterFields
    }
  }
`;

export const DELETE_CHARACTER_MUTATION = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id)
  }
`;

export const TAKE_DAMAGE_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation TakeDamage($id: ID!, $damage: Int!) {
    takeDamage(id: $id, damage: $damage) {
      ...CharacterFields
    }
  }
`;

export const HEAL_CHARACTER_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation HealCharacter($id: ID!, $amount: Int!) {
    healCharacter(id: $id, amount: $amount) {
      ...CharacterFields
    }
  }
`;

export const SPEND_LUCK_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation SpendLuck($id: ID!, $amount: Int!) {
    spendLuck(id: $id, amount: $amount) {
      ...CharacterFields
    }
  }
`;

export const RESTORE_LUCK_MUTATION = gql`
  ${CHARACTER_FRAGMENT}
  mutation RestoreLuck($id: ID!) {
    restoreLuck(id: $id) {
      ...CharacterFields
    }
  }
`;
