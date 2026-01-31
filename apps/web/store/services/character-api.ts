import { api } from '../api';
import { gql } from 'graphql-request';

// Types matching the backend
interface Stats {
  intelligence: number;
  reflexes: number;
  dexterity: number;
  technology: number;
  cool: number;
  willpower: number;
  luck: number;
  move: number;
  body: number;
  empathy: number;
}

interface Skill {
  name: string;
  linkedStat: string;
  level: number;
  ipSpent?: number;
}

interface Cyberware {
  name: string;
  type: string;
  installation: string;
  description: string;
  humanityLoss: number;
  cost: number;
  optionSlots?: number;
  foundational?: boolean;
}

interface Weapon {
  name: string;
  type: string;
  damage: string;
  rof: number;
  magazine?: number;
  skill?: string;
  handsRequired?: number;
  concealable?: boolean;
}

interface Armor {
  name: string;
  type: string;
  stoppingPower: number;
  penalty?: number;
}

interface InventoryItem {
  name: string;
  description?: string;
  quantity: number;
  cost?: number;
  category?: string;
}

interface RoleAbility {
  name: string;
  rank: number;
  description?: string;
  specializations?: string[];
}

interface Lifepath {
  culturalOrigin?: string;
  personality?: string;
  clothingStyle?: string;
  hairstyle?: string;
  valueMost?: string;
  feelingsAboutPeople?: string;
  valuedPerson?: string;
  valuedPossession?: string;
  familyBackground?: string;
  childhoodEnvironment?: string;
  familyCrisis?: string;
  lifeGoals?: string[];
  friends?: string[];
  enemies?: string[];
  romanticInvolvements?: string[];
}

export interface Character {
  _id: string;
  userId: string;
  handle: string;
  realName?: string;
  role: string;
  level: number;
  stats: Stats;
  maxHitPoints: number;
  currentHitPoints: number;
  seriouslyWoundedThreshold: number;
  deathSave: number;
  humanity: number;
  roleAbility: RoleAbility;
  skills: Skill[];
  cyberware: Cyberware[];
  weapons: Weapon[];
  armor: Armor[];
  inventory: InventoryItem[];
  eurodollars: number;
  lifepath?: Lifepath;
  improvementPoints: number;
  currentLuck: number;
  notes?: string;
  portraitUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const CHARACTER_FRAGMENT = gql`
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
    improvementPoints
    currentLuck
    notes
    portraitUrl
    createdAt
    updatedAt
  }
`;

export const characterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyCharacters: builder.query<Character[], void>({
      query: () => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          query MyCharacters {
            myCharacters {
              ...CharacterFields
            }
          }
        `,
      }),
      transformResponse: (response: { myCharacters: Character[] }) => response.myCharacters,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Character' as const, id: _id })), 'Character']
          : ['Character'],
    }),

    getCharacter: builder.query<Character, string>({
      query: (id) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          query Character($id: ID!) {
            character(id: $id) {
              ...CharacterFields
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { character: Character }) => response.character,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),

    createCharacter: builder.mutation<Character, Partial<Character>>({
      query: (input) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation CreateCharacter($input: CreateCharacterInput!) {
            createCharacter(input: $input) {
              ...CharacterFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { createCharacter: Character }) => response.createCharacter,
      invalidatesTags: ['Character'],
    }),

    updateCharacter: builder.mutation<Character, { id: string } & Partial<Character>>({
      query: (input) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation UpdateCharacter($input: UpdateCharacterInput!) {
            updateCharacter(input: $input) {
              ...CharacterFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { updateCharacter: Character }) => response.updateCharacter,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Character', id }],
    }),

    deleteCharacter: builder.mutation<boolean, string>({
      query: (id) => ({
        document: gql`
          mutation DeleteCharacter($id: ID!) {
            deleteCharacter(id: $id)
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { deleteCharacter: boolean }) => response.deleteCharacter,
      invalidatesTags: ['Character'],
    }),

    takeDamage: builder.mutation<Character, { id: string; damage: number }>({
      query: ({ id, damage }) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation TakeDamage($id: ID!, $damage: Int!) {
            takeDamage(id: $id, damage: $damage) {
              ...CharacterFields
            }
          }
        `,
        variables: { id, damage },
      }),
      transformResponse: (response: { takeDamage: Character }) => response.takeDamage,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Character', id }],
    }),

    healCharacter: builder.mutation<Character, { id: string; amount: number }>({
      query: ({ id, amount }) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation HealCharacter($id: ID!, $amount: Int!) {
            healCharacter(id: $id, amount: $amount) {
              ...CharacterFields
            }
          }
        `,
        variables: { id, amount },
      }),
      transformResponse: (response: { healCharacter: Character }) => response.healCharacter,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Character', id }],
    }),

    spendLuck: builder.mutation<Character, { id: string; amount: number }>({
      query: ({ id, amount }) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation SpendLuck($id: ID!, $amount: Int!) {
            spendLuck(id: $id, amount: $amount) {
              ...CharacterFields
            }
          }
        `,
        variables: { id, amount },
      }),
      transformResponse: (response: { spendLuck: Character }) => response.spendLuck,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Character', id }],
    }),

    restoreLuck: builder.mutation<Character, string>({
      query: (id) => ({
        document: gql`
          ${CHARACTER_FRAGMENT}
          mutation RestoreLuck($id: ID!) {
            restoreLuck(id: $id) {
              ...CharacterFields
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { restoreLuck: Character }) => response.restoreLuck,
      invalidatesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const {
  useGetMyCharactersQuery,
  useGetCharacterQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
  useTakeDamageMutation,
  useHealCharacterMutation,
  useSpendLuckMutation,
  useRestoreLuckMutation,
} = characterApi;
