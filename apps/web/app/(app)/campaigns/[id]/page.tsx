'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

import {
  useGetCampaignQuery,
  useDeleteCampaignMutation,
  useAddJournalEntryMutation,
  Campaign,
  JournalEntry,
} from '@/store/services/campaign-api';

const ENTRY_TYPE_COLORS = {
  SESSION: 'neon-cyan',
  QUEST: 'neon-magenta',
  NPC: 'neon-violet',
  LOCATION: 'green',
  NOTE: 'yellow',
  LOOT: 'orange',
};

const ENTRY_TYPE_LABELS = {
  SESSION: 'Session',
  QUEST: 'Quête',
  NPC: 'PNJ',
  LOCATION: 'Lieu',
  NOTE: 'Note',
  LOOT: 'Butin',
};

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations();
  const router = useRouter();
  const { data: campaign, isLoading, error } = useGetCampaignQuery(id);
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [addJournalEntry, { isLoading: isAddingEntry }] = useAddJournalEntryMutation();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    type: 'NOTE' as JournalEntry['type'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-neon-violet-500/30 border-t-neon-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-4 md:p-8">
        <div className="card border-neon-magenta-500/30 text-center py-8">
          <p className="text-neon-magenta-400">{t('common.error')}</p>
          <p className="text-cyber-dark-500 text-sm mt-2">Campagne non trouvée</p>
          <Link href="/campaigns" className="btn-primary mt-4 inline-block">
            Retour aux campagnes
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteCampaign(id);
    router.push('/campaigns');
  };

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    await addJournalEntry({
      campaignId: id,
      title: newEntry.title,
      content: newEntry.content,
      type: newEntry.type,
    });
    setNewEntry({ title: '', content: '', type: 'NOTE' });
    setShowAddEntry(false);
  };

  const filteredEntries = activeFilter
    ? campaign.journalEntries.filter((e) => e.type === activeFilter)
    : campaign.journalEntries;

  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sessionCount = campaign.journalEntries.filter((e) => e.type === 'SESSION').length;
  const questCount = campaign.journalEntries.filter((e) => e.type === 'QUEST').length;
  const npcCount = campaign.journalEntries.filter((e) => e.type === 'NPC').length;

  return (
    <div className="p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <Link
            href="/campaigns"
            className="text-cyber-dark-500 hover:text-neon-violet-400 text-sm mb-2 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <h1 className="text-2xl md:text-3xl font-cyber font-bold bg-gradient-to-r from-neon-violet-400 to-neon-magenta-400 bg-clip-text text-transparent">
            {campaign.name}
          </h1>
          {campaign.description && <p className="text-cyber-dark-400 text-sm mt-1">{campaign.description}</p>}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddEntry(true)}
            className="btn-primary flex-1 sm:flex-none font-cyber min-h-[44px]"
          >
            + Entrée
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-secondary flex-1 sm:flex-none font-cyber min-h-[44px] text-neon-magenta-400 border-neon-magenta-500/30 hover:bg-neon-magenta-500/10"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Status & Stats */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            campaign.isActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-cyber-dark-700 text-cyber-dark-400'
          }`}
        >
          {campaign.isActive ? 'Active' : 'Inactive'}
        </span>
        <span className="px-3 py-1 bg-cyber-dark-800 border border-neon-cyan-500/30 rounded-full text-sm font-medium text-neon-cyan-400">
          Session #{campaign.currentSession}
        </span>
        <span className="px-3 py-1 bg-cyber-dark-800 border border-cyber-dark-700 rounded-full text-sm font-medium text-cyber-dark-300">
          {campaign.playerIds.length} joueur(s)
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <p className="stat-value text-neon-cyan-400 text-2xl">{sessionCount}</p>
          <p className="stat-label text-xs">Sessions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="stat-value text-neon-magenta-400 text-2xl">{questCount}</p>
          <p className="stat-label text-xs">Quêtes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="stat-value text-neon-violet-400 text-2xl">{npcCount}</p>
          <p className="stat-label text-xs">PNJ</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-lg font-cyber text-sm whitespace-nowrap min-h-[44px] ${
            activeFilter === null
              ? 'bg-neon-violet-500/20 text-neon-violet-400 border border-neon-violet-500/50'
              : 'bg-cyber-dark-800 text-cyber-dark-400 border border-cyber-dark-700 hover:border-neon-violet-500/30'
          }`}
        >
          Tout ({campaign.journalEntries.length})
        </button>
        {Object.entries(ENTRY_TYPE_LABELS).map(([type, label]) => {
          const count = campaign.journalEntries.filter((e) => e.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-lg font-cyber text-sm whitespace-nowrap min-h-[44px] ${
                activeFilter === type
                  ? 'bg-neon-violet-500/20 text-neon-violet-400 border border-neon-violet-500/50'
                  : 'bg-cyber-dark-800 text-cyber-dark-400 border border-cyber-dark-700 hover:border-neon-violet-500/30'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Journal Entries */}
      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <JournalEntryCard key={entry._id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="card card-glow text-center py-12 relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-violet-500/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-neon-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-cyber-dark-400 mb-4">Aucune entrée dans le journal</p>
          <button onClick={() => setShowAddEntry(true)} className="btn-primary font-cyber min-h-[48px] px-6">
            Ajouter une entrée
          </button>
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="card card-glow w-full sm:max-w-lg relative rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4" />

            <h2 className="text-xl font-cyber font-bold mb-5 bg-gradient-to-r from-neon-violet-400 to-neon-magenta-400 bg-clip-text text-transparent">
              Nouvelle entrée
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neon-violet-400/80">Type *</label>
                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as JournalEntry['type'] })}
                  className="input-field w-full h-12"
                >
                  {Object.entries(ENTRY_TYPE_LABELS).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neon-violet-400/80">Titre *</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="input-field w-full h-12"
                  placeholder="Titre de l'entrée..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neon-violet-400/80">Contenu *</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="input-field w-full h-32 resize-none"
                  placeholder="Décrivez les événements..."
                />
              </div>

              <div className="flex gap-3 pt-4 pb-safe">
                <button onClick={() => setShowAddEntry(false)} className="btn-secondary flex-1 font-cyber min-h-[48px]">
                  Annuler
                </button>
                <button
                  onClick={handleAddEntry}
                  disabled={isAddingEntry || !newEntry.title.trim() || !newEntry.content.trim()}
                  className="btn-primary flex-1 font-cyber min-h-[48px]"
                >
                  {isAddingEntry ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card card-glow max-w-md relative">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <h2 className="text-xl font-cyber font-bold text-neon-magenta-400 mb-4">Confirmer la suppression</h2>
            <p className="text-cyber-dark-300 mb-6">
              Voulez-vous vraiment supprimer <span className="text-white font-semibold">{campaign.name}</span> ? Toutes
              les entrées du journal seront perdues. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1 min-h-[44px]">
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary flex-1 min-h-[44px] bg-neon-magenta-600 hover:bg-neon-magenta-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = ENTRY_TYPE_COLORS[entry.type] || 'neon-violet';
  const typeLabel = ENTRY_TYPE_LABELS[entry.type] || entry.type;

  return (
    <div className="card card-glow relative">
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />

      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 bg-${colorClass}-500/20 text-${colorClass}-400 rounded text-xs font-medium`}>
              {typeLabel}
            </span>
            {entry.sessionNumber && (
              <span className="text-cyber-dark-500 text-xs">Session #{entry.sessionNumber}</span>
            )}
          </div>
          <h3 className="font-semibold text-white">{entry.title}</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyber-dark-500 hover:text-neon-violet-400 p-1"
        >
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="pt-3 border-t border-cyber-dark-700">
          <p className="text-cyber-dark-300 text-sm whitespace-pre-wrap mb-3">{entry.content}</p>

          {/* NPC-specific fields */}
          {entry.type === 'NPC' && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {entry.npcRole && (
                <div>
                  <span className="text-cyber-dark-500">Rôle: </span>
                  <span className="text-white">{entry.npcRole}</span>
                </div>
              )}
              {entry.npcLocation && (
                <div>
                  <span className="text-cyber-dark-500">Lieu: </span>
                  <span className="text-white">{entry.npcLocation}</span>
                </div>
              )}
              {entry.npcAttitude && (
                <div>
                  <span className="text-cyber-dark-500">Attitude: </span>
                  <span className="text-white">{entry.npcAttitude}</span>
                </div>
              )}
            </div>
          )}

          {/* Quest-specific fields */}
          {entry.type === 'QUEST' && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {entry.questStatus && (
                <div>
                  <span className="text-cyber-dark-500">Statut: </span>
                  <span className="text-white">{entry.questStatus}</span>
                </div>
              )}
              {entry.questGiver && (
                <div>
                  <span className="text-cyber-dark-500">Donneur: </span>
                  <span className="text-white">{entry.questGiver}</span>
                </div>
              )}
              {entry.questReward && (
                <div>
                  <span className="text-cyber-dark-500">Récompense: </span>
                  <span className="text-green-400">{entry.questReward}€$</span>
                </div>
              )}
            </div>
          )}

          {/* Location-specific fields */}
          {entry.type === 'LOCATION' && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {entry.district && (
                <div>
                  <span className="text-cyber-dark-500">District: </span>
                  <span className="text-white">{entry.district}</span>
                </div>
              )}
              {entry.locationType && (
                <div>
                  <span className="text-cyber-dark-500">Type: </span>
                  <span className="text-white">{entry.locationType}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {entry.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-cyber-dark-800 text-cyber-dark-400 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-cyber-dark-600 text-xs">
            {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}

      {!expanded && (
        <p className="text-cyber-dark-400 text-sm line-clamp-2">{entry.content}</p>
      )}
    </div>
  );
}
