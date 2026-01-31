'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useGetMyCharactersQuery } from '@/store/services/character-api';

export default function CharactersPage() {
  const t = useTranslations();
  const { data: characters, isLoading, error } = useGetMyCharactersQuery();

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-cyber font-bold bg-gradient-to-r from-neon-magenta-400 to-neon-violet-400 bg-clip-text text-transparent">
          {t('character.title')}
        </h1>
        <Link href="/characters/new" className="btn-primary font-cyber min-h-[48px] flex items-center justify-center w-full sm:w-auto">
          {t('character.create')}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 md:py-16">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-neon-magenta-500/30 border-t-neon-magenta-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card border-neon-magenta-500/30 text-center py-6 md:py-8">
          <p className="text-neon-magenta-400 text-sm md:text-base">{t('common.error')}</p>
          <p className="text-cyber-dark-500 text-xs mt-2">
            {'message' in error ? String(error.message) : 'Erreur de chargement'}
          </p>
        </div>
      ) : characters && characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {characters.map((character) => (
            <CharacterCard key={character._id} character={character} />
          ))}
        </div>
      ) : (
        <div className="card card-glow text-center py-12 md:py-16 relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="corner-decoration bottom-left" />
          <div className="corner-decoration bottom-right" />

          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-neon-magenta-500/10 flex items-center justify-center">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-neon-magenta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-cyber-dark-400 mb-4 text-sm md:text-base">{t('common.noResults')}</p>
          <Link href="/characters/new" className="btn-primary font-cyber min-h-[48px] inline-flex items-center justify-center px-6">
            {t('character.create')}
          </Link>
        </div>
      )}
    </div>
  );
}

function CharacterCard({
  character,
}: {
  character: {
    _id: string;
    handle: string;
    realName?: string;
    role: string;
    level: number;
    currentHitPoints: number;
    maxHitPoints: number;
    humanity: number;
    eurodollars: number;
  };
}) {
  const hpPercentage = (character.currentHitPoints / character.maxHitPoints) * 100;

  return (
    <Link
      href={`/characters/${character._id}`}
      className="card card-glow group active:border-neon-magenta-400/60 transition-all relative min-h-[180px]"
    >
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />
      <div className="corner-decoration bottom-left" />
      <div className="corner-decoration bottom-right" />

      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-cyber font-semibold text-white group-active:text-neon-magenta-400 transition-colors truncate">
            {character.handle}
          </h3>
          {character.realName && (
            <p className="text-xs md:text-sm text-cyber-dark-400 truncate">{character.realName}</p>
          )}
        </div>
        <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-neon-magenta-600 to-neon-violet-600 rounded-full text-xs md:text-sm font-medium flex-shrink-0">
          {character.role}
        </span>
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between text-xs md:text-sm mb-2">
            <span className="text-cyber-dark-400">HP</span>
            <span className="text-white font-mono tabular-nums">
              {character.currentHitPoints}/{character.maxHitPoints}
            </span>
          </div>
          <div className="hp-bar">
            <div
              className={`hp-bar-fill ${
                hpPercentage > 50 ? 'high' : hpPercentage > 25 ? 'medium' : 'low'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="stat-box p-2 md:p-3">
            <p className="stat-value text-base md:text-lg">{character.level}</p>
            <p className="stat-label text-[10px] md:text-xs">Niveau</p>
          </div>
          <div className="stat-box p-2 md:p-3">
            <p className="stat-value text-base md:text-lg">{character.humanity}</p>
            <p className="stat-label text-[10px] md:text-xs">Humanité</p>
          </div>
          <div className="stat-box p-2 md:p-3">
            <p className="stat-value font-mono text-base md:text-lg">{character.eurodollars}</p>
            <p className="stat-label text-[10px] md:text-xs">€$</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
