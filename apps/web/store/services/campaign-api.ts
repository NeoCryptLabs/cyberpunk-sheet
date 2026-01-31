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
  createdAt: string;
  updatedAt: string;
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
  }),
});

export const {
  useGetMyCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useAddJournalEntryMutation,
} = campaignApi;
