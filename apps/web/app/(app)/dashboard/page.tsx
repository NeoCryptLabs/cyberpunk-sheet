'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useGetMyCharactersQuery } from '@/store/services/character-api';
import { useGetMyCampaignsQuery } from '@/store/services/campaign-api';

export default function DashboardPage() {
  const t = useTranslations();
  const { data: characters, isLoading: loadingChars } = useGetMyCharactersQuery();
  const { data: campaigns, isLoading: loadingCamps } = useGetMyCampaignsQuery();

  return (
    <div className="p-4 md:p-8 pb-24">
      <h1 className="text-2xl md:text-3xl font-cyber font-bold mb-6 md:mb-8 bg-gradient-to-r from-neon-cyan-400 to-neon-violet-400 bg-clip-text text-transparent">
        {t('nav.home')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Actions */}
        <div className="card card-glow relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <h2 className="text-lg md:text-xl font-cyber font-semibold text-neon-cyan-400 mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <Link href="/characters/new" className="block btn-primary text-center font-cyber min-h-[48px] flex items-center justify-center">
              {t('character.create')}
            </Link>
            <Link href="/campaigns" className="block btn-secondary text-center font-cyber min-h-[48px] flex items-center justify-center">
              {t('campaign.create')}
            </Link>
          </div>
        </div>

        {/* Recent Characters */}
        <div className="card card-glow lg:col-span-2 relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-cyber font-semibold text-neon-magenta-400">
              {t('character.title')}
            </h2>
            <Link href="/characters" className="text-sm text-neon-cyan-400 active:text-neon-cyan-300 transition-colors min-h-[44px] flex items-center">
              Voir tout →
            </Link>
          </div>

          {loadingChars ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-neon-magenta-500/30 border-t-neon-magenta-500 rounded-full animate-spin" />
            </div>
          ) : characters && characters.length > 0 ? (
            <div className="space-y-3">
              {characters.slice(0, 3).map((character) => {
                const hpPercentage = (character.currentHitPoints / character.maxHitPoints) * 100;
                return (
                  <Link
                    key={character._id}
                    href={`/characters/${character._id}`}
                    className="block p-3 md:p-4 rounded-xl bg-cyber-dark-900/50 border border-cyber-dark-700 active:border-neon-magenta-500/50 active:bg-cyber-dark-900 transition-all group min-h-[72px]"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-cyber font-semibold text-white group-active:text-neon-magenta-400 transition-colors truncate">
                          {character.handle}
                        </p>
                        <p className="text-xs md:text-sm text-cyber-dark-400">
                          {character.role} - Lvl {character.level}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-16 md:w-24 h-2 bg-cyber-dark-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                hpPercentage > 50
                                  ? 'bg-gradient-to-r from-green-500 to-neon-cyan-500'
                                  : hpPercentage > 25
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-cyber-red-600 to-neon-magenta-600'
                              }`}
                              style={{ width: `${hpPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs md:text-sm text-cyber-dark-400 tabular-nums">
                            {character.currentHitPoints}/{character.maxHitPoints}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-neon-cyan-400 font-mono">
                          {character.eurodollars}€$
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8">
              <p className="text-cyber-dark-400 mb-4 text-sm md:text-base">{t('common.noResults')}</p>
              <Link href="/characters/new" className="btn-primary font-cyber inline-flex items-center justify-center min-h-[48px] px-6">
                Créer un personnage
              </Link>
            </div>
          )}
        </div>

        {/* Active Campaigns */}
        <div className="card card-glow lg:col-span-2 relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-cyber font-semibold text-neon-violet-400">
              Campagnes actives
            </h2>
            <Link href="/campaigns" className="text-sm text-neon-cyan-400 active:text-neon-cyan-300 transition-colors min-h-[44px] flex items-center">
              Voir tout →
            </Link>
          </div>

          {loadingCamps ? (
            <div className="flex items-center justify-center py-6 md:py-8">
              <div className="w-8 h-8 border-2 border-neon-violet-500/30 border-t-neon-violet-500 rounded-full animate-spin" />
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns
                .filter((c) => c.isActive)
                .slice(0, 3)
                .map((campaign) => (
                  <Link
                    key={campaign._id}
                    href={`/campaigns/${campaign._id}`}
                    className="block p-3 md:p-4 rounded-xl bg-cyber-dark-900/50 border border-cyber-dark-700 active:border-neon-violet-500/50 active:bg-cyber-dark-900 transition-all group min-h-[72px]"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-cyber font-semibold text-white group-active:text-neon-violet-400 transition-colors truncate">
                          {campaign.name}
                        </p>
                        <p className="text-xs md:text-sm text-cyber-dark-400">
                          Session #{campaign.currentSession} • {campaign.playerIds.length} joueur(s)
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8">
              <p className="text-cyber-dark-400 mb-4 text-sm md:text-base">{t('common.noResults')}</p>
              <Link href="/campaigns" className="btn-primary font-cyber inline-flex items-center justify-center min-h-[48px] px-6">
                Créer une campagne
              </Link>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="card card-glow relative lg:col-span-1">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <h2 className="text-lg md:text-xl font-cyber font-semibold text-neon-cyan-400 mb-4">
            Statistiques
          </h2>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4">
            <div className="flex flex-col lg:flex-row justify-between items-center p-3 rounded-lg bg-cyber-dark-900/50">
              <span className="text-cyber-dark-400 text-xs md:text-sm mb-1 lg:mb-0">Personnages</span>
              <span className="text-xl md:text-2xl font-cyber text-neon-magenta-400">
                {loadingChars ? '-' : characters?.length || 0}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center p-3 rounded-lg bg-cyber-dark-900/50">
              <span className="text-cyber-dark-400 text-xs md:text-sm mb-1 lg:mb-0">Campagnes</span>
              <span className="text-xl md:text-2xl font-cyber text-neon-violet-400">
                {loadingCamps ? '-' : campaigns?.length || 0}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center p-3 rounded-lg bg-cyber-dark-900/50">
              <span className="text-cyber-dark-400 text-xs md:text-sm mb-1 lg:mb-0 text-center">Sessions</span>
              <span className="text-xl md:text-2xl font-cyber text-neon-cyan-400">
                {loadingCamps
                  ? '-'
                  : campaigns?.reduce((sum, c) => sum + c.currentSession, 0) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
