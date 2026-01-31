'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useGetMyCampaignsQuery, useCreateCampaignMutation, Campaign } from '@/store/services/campaign-api';

export default function CampaignsPage() {
  const t = useTranslations();
  const { data: campaigns, isLoading, error } = useGetMyCampaignsQuery();
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [showModal, setShowModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) return;
    try {
      const campaignData: { name: string; description?: string } = {
        name: newCampaignName,
      };
      if (newCampaignDesc) {
        campaignData.description = newCampaignDesc;
      }
      await createCampaign(campaignData).unwrap();
      setShowModal(false);
      setNewCampaignName('');
      setNewCampaignDesc('');
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-cyber font-bold bg-gradient-to-r from-neon-violet-400 to-neon-magenta-400 bg-clip-text text-transparent">
          {t('campaign.title')}
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary font-cyber min-h-[48px] w-full sm:w-auto">
          {t('campaign.create')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 md:py-16">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-neon-violet-500/30 border-t-neon-violet-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card border-neon-magenta-500/30 text-center py-6 md:py-8">
          <p className="text-neon-magenta-400 text-sm md:text-base">{t('common.error')}</p>
          <p className="text-cyber-dark-500 text-xs mt-2">
            {'message' in error ? String(error.message) : 'Erreur de chargement'}
          </p>
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="card card-glow text-center py-12 md:py-16 relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-neon-violet-500/10 flex items-center justify-center">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-neon-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-cyber-dark-400 mb-4 text-sm md:text-base">{t('common.noResults')}</p>
          <button onClick={() => setShowModal(true)} className="btn-primary font-cyber min-h-[48px] px-6">
            {t('campaign.create')}
          </button>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="card card-glow w-full sm:max-w-md relative rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />

            {/* Mobile drag indicator */}
            <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4" />

            <h2 className="text-xl md:text-2xl font-cyber font-bold mb-5 md:mb-6 bg-gradient-to-r from-neon-violet-400 to-neon-magenta-400 bg-clip-text text-transparent">
              {t('campaign.create')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neon-violet-400/80">
                  Nom de la campagne *
                </label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="input-field w-full h-12"
                  placeholder="Ex: Night City Chronicles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neon-violet-400/80">
                  Description
                </label>
                <textarea
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  className="input-field w-full h-28 md:h-24 resize-none"
                  placeholder="Décrivez votre campagne..."
                />
              </div>

              <div className="flex gap-3 pt-4 pb-safe">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 font-cyber min-h-[48px]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={isCreating || !newCampaignName.trim()}
                  className="btn-primary flex-1 font-cyber min-h-[48px]"
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const sessionCount = campaign.journalEntries.filter((e) => e.type === 'SESSION').length;
  const questCount = campaign.journalEntries.filter((e) => e.type === 'QUEST').length;
  const npcCount = campaign.journalEntries.filter((e) => e.type === 'NPC').length;

  return (
    <Link
      href={`/campaigns/${campaign._id}`}
      className="card card-glow group active:border-neon-violet-400/60 transition-all relative min-h-[200px]"
    >
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />
      <div className="corner-decoration bottom-left" />
      <div className="corner-decoration bottom-right" />

      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-cyber font-semibold text-white group-active:text-neon-violet-400 transition-colors truncate">
            {campaign.name}
          </h3>
          {campaign.description && (
            <p className="text-xs md:text-sm text-cyber-dark-400 mt-1 line-clamp-2">{campaign.description}</p>
          )}
        </div>
        <span
          className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            campaign.isActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-cyber-dark-700 text-cyber-dark-400'
          }`}
        >
          {campaign.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="stat-box p-2 md:p-3">
          <p className="stat-value text-neon-cyan-400 text-base md:text-lg">{sessionCount}</p>
          <p className="stat-label text-[10px] md:text-xs">Sessions</p>
        </div>
        <div className="stat-box p-2 md:p-3">
          <p className="stat-value text-neon-magenta-400 text-base md:text-lg">{questCount}</p>
          <p className="stat-label text-[10px] md:text-xs">Quêtes</p>
        </div>
        <div className="stat-box p-2 md:p-3">
          <p className="stat-value text-neon-violet-400 text-base md:text-lg">{npcCount}</p>
          <p className="stat-label text-[10px] md:text-xs">PNJ</p>
        </div>
      </div>

      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-cyber-dark-700 flex justify-between text-xs md:text-sm text-cyber-dark-500">
        <span>Session #{campaign.currentSession}</span>
        <span>{campaign.playerIds.length} joueur(s)</span>
      </div>
    </Link>
  );
}
