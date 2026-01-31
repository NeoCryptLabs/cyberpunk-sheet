import { api } from '../api';
import { gql } from 'graphql-request';

export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  type: 'SESSION' | 'QUEST' | 'NPC' | 'LOCATION' | 'NOTE' | 'LOOT';
  tags: string[];
  imageUrl?: string;
  sessionNumber?: number;
  sessionDate?: string;
  npcRole?: string;
  npcLocation?: string;
  npcAttitude?: string;
  questStatus?: string;
  questGiver?: string;
  questReward?: number;
  district?: string;
  locationType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  gameMasterId: string;
  playerIds: string[];
  characterIds: string[];
  journalEntries: JournalEntry[];
  currentSession: number;
  imageUrl?: string;
  isActive: boolean;
  inviteCode?: string;
  inviteCodeExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCharacter {
  _id: string;
  userId: string;
  handle: string;
  role: string;
  stats: {
    int: number;
    ref: number;
    dex: number;
    tech: number;
    cool: number;
    will: number;
    luck: number;
    move: number;
    body: number;
    emp: number;
  };
  hitPoints: { current: number; max: number };
  humanity: { current: number; max: number };
  imageUrl?: string;
}

const CAMPAIGN_FRAGMENT = gql`
  fragment CampaignFields on Campaign {
    _id
    name
    description
    gameMasterId
    playerIds
    characterIds
    journalEntries {
      _id
      title
      content
      type
      tags
      imageUrl
      sessionNumber
      sessionDate
      npcRole
      npcLocation
      npcAttitude
      questStatus
      questGiver
      questReward
      district
      locationType
      createdAt
      updatedAt
    }
    currentSession
    imageUrl
    isActive
    createdAt
    updatedAt
  }
`;

export const campaignApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyCampaigns: builder.query<Campaign[], void>({
      query: () => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          query MyCampaigns {
            myCampaigns {
              ...CampaignFields
            }
          }
        `,
      }),
      transformResponse: (response: { myCampaigns: Campaign[] }) => response.myCampaigns,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Campaign' as const, id: _id })), 'Campaign']
          : ['Campaign'],
    }),

    getCampaign: builder.query<Campaign, string>({
      query: (id) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          query Campaign($id: ID!) {
            campaign(id: $id) {
              ...CampaignFields
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { campaign: Campaign }) => response.campaign,
      providesTags: (_result, _error, id) => [{ type: 'Campaign', id }],
    }),

    createCampaign: builder.mutation<Campaign, { name: string; description?: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation CreateCampaign($input: CreateCampaignInput!) {
            createCampaign(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { createCampaign: Campaign }) => response.createCampaign,
      invalidatesTags: ['Campaign'],
    }),

    updateCampaign: builder.mutation<Campaign, { id: string; name?: string; description?: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation UpdateCampaign($input: UpdateCampaignInput!) {
            updateCampaign(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { updateCampaign: Campaign }) => response.updateCampaign,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Campaign', id }],
    }),

    deleteCampaign: builder.mutation<boolean, string>({
      query: (id) => ({
        document: gql`
          mutation DeleteCampaign($id: ID!) {
            deleteCampaign(id: $id)
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { deleteCampaign: boolean }) => response.deleteCampaign,
      invalidatesTags: ['Campaign'],
    }),

    addJournalEntry: builder.mutation<
      Campaign,
      { campaignId: string; title: string; content: string; type: string; tags?: string[] }
    >({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation AddJournalEntry($input: CreateJournalEntryInput!) {
            addJournalEntry(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { addJournalEntry: Campaign }) => response.addJournalEntry,
      invalidatesTags: (_result, _error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
    }),

    // ============================================
    // PLAYER MANAGEMENT ENDPOINTS
    // ============================================

    generateInviteCode: builder.mutation<string, { campaignId: string }>({
      query: (input) => ({
        document: gql`
          mutation GenerateInviteCode($input: GenerateInviteCodeInput!) {
            generateInviteCode(input: $input)
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { generateInviteCode: string }) => response.generateInviteCode,
      invalidatesTags: (_result, _error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
    }),

    joinCampaign: builder.mutation<Campaign, { inviteCode: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation JoinCampaign($input: JoinCampaignInput!) {
            joinCampaign(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { joinCampaign: Campaign }) => response.joinCampaign,
      invalidatesTags: ['Campaign'],
    }),

    removePlayer: builder.mutation<Campaign, { campaignId: string; userId: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation RemovePlayer($input: RemovePlayerInput!) {
            removePlayer(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { removePlayer: Campaign }) => response.removePlayer,
      invalidatesTags: (_result, _error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
    }),

    linkCharacterToCampaign: builder.mutation<Campaign, { campaignId: string; characterId: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation LinkCharacterToCampaign($input: LinkCharacterInput!) {
            linkCharacterToCampaign(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { linkCharacterToCampaign: Campaign }) =>
        response.linkCharacterToCampaign,
      invalidatesTags: (_result, _error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
    }),

    unlinkCharacterFromCampaign: builder.mutation<Campaign, { campaignId: string; characterId: string }>({
      query: (input) => ({
        document: gql`
          ${CAMPAIGN_FRAGMENT}
          mutation UnlinkCharacterFromCampaign($input: UnlinkCharacterInput!) {
            unlinkCharacterFromCampaign(input: $input) {
              ...CampaignFields
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { unlinkCharacterFromCampaign: Campaign }) =>
        response.unlinkCharacterFromCampaign,
      invalidatesTags: (_result, _error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
    }),

    getCampaignCharacters: builder.query<CampaignCharacter[], string>({
      query: (campaignId) => ({
        document: gql`
          query CampaignCharacters($campaignId: ID!) {
            campaignCharacters(campaignId: $campaignId) {
              _id
              userId
              handle
              role
              stats {
                int
                ref
                dex
                tech
                cool
                will
                luck
                move
                body
                emp
              }
              hitPoints {
                current
                max
              }
              humanity {
                current
                max
              }
              imageUrl
            }
          }
        `,
        variables: { campaignId },
      }),
      transformResponse: (response: { campaignCharacters: CampaignCharacter[] }) =>
        response.campaignCharacters,
      providesTags: (_result, _error, campaignId) => [{ type: 'Campaign', id: campaignId }],
    }),
  }),
});

export const {
  useGetMyCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useAddJournalEntryMutation,
  useGenerateInviteCodeMutation,
  useJoinCampaignMutation,
  useRemovePlayerMutation,
  useLinkCharacterToCampaignMutation,
  useUnlinkCharacterFromCampaignMutation,
  useGetCampaignCharactersQuery,
} = campaignApi;
