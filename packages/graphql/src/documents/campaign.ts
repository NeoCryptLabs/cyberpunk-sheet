import { gql } from 'graphql-tag';

export const JOURNAL_ENTRY_FRAGMENT = gql`
  fragment JournalEntryFields on JournalEntry {
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
`;

export const CAMPAIGN_FRAGMENT = gql`
  ${JOURNAL_ENTRY_FRAGMENT}
  fragment CampaignFields on Campaign {
    _id
    name
    description
    gameMasterId
    playerIds
    characterIds
    journalEntries {
      ...JournalEntryFields
    }
    currentSession
    imageUrl
    isActive
    createdAt
    updatedAt
  }
`;

export const MY_CAMPAIGNS_QUERY = gql`
  ${CAMPAIGN_FRAGMENT}
  query MyCampaigns {
    myCampaigns {
      ...CampaignFields
    }
  }
`;

export const CAMPAIGN_QUERY = gql`
  ${CAMPAIGN_FRAGMENT}
  query Campaign($id: ID!) {
    campaign(id: $id) {
      ...CampaignFields
    }
  }
`;

export const CREATE_CAMPAIGN_MUTATION = gql`
  ${CAMPAIGN_FRAGMENT}
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      ...CampaignFields
    }
  }
`;

export const UPDATE_CAMPAIGN_MUTATION = gql`
  ${CAMPAIGN_FRAGMENT}
  mutation UpdateCampaign($input: UpdateCampaignInput!) {
    updateCampaign(input: $input) {
      ...CampaignFields
    }
  }
`;

export const DELETE_CAMPAIGN_MUTATION = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

export const ADD_JOURNAL_ENTRY_MUTATION = gql`
  ${CAMPAIGN_FRAGMENT}
  mutation AddJournalEntry($input: CreateJournalEntryInput!) {
    addJournalEntry(input: $input) {
      ...CampaignFields
    }
  }
`;

export const UPDATE_JOURNAL_ENTRY_MUTATION = gql`
  ${CAMPAIGN_FRAGMENT}
  mutation UpdateJournalEntry($input: UpdateJournalEntryInput!) {
    updateJournalEntry(input: $input) {
      ...CampaignFields
    }
  }
`;

export const DELETE_JOURNAL_ENTRY_MUTATION = gql`
  ${CAMPAIGN_FRAGMENT}
  mutation DeleteJournalEntry($campaignId: ID!, $entryId: ID!) {
    deleteJournalEntry(campaignId: $campaignId, entryId: $entryId) {
      ...CampaignFields
    }
  }
`;

export const JOURNAL_ENTRIES_BY_TYPE_QUERY = gql`
  ${JOURNAL_ENTRY_FRAGMENT}
  query JournalEntriesByType($campaignId: ID!, $type: JournalEntryType!) {
    journalEntriesByType(campaignId: $campaignId, type: $type) {
      ...JournalEntryFields
    }
  }
`;

export const SEARCH_JOURNAL_ENTRIES_QUERY = gql`
  ${JOURNAL_ENTRY_FRAGMENT}
  query SearchJournalEntries($campaignId: ID!, $query: String!) {
    searchJournalEntries(campaignId: $campaignId, query: $query) {
      ...JournalEntryFields
    }
  }
`;
