'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  useGetCampaignCharactersQuery,
  CampaignCharacter,
} from '@/store/services/campaign-api';

interface CampaignCharactersProps {
  campaignId: string;
}

export function CampaignCharacters({ campaignId }: CampaignCharactersProps) {
  const { data: characters, isLoading, error } = useGetCampaignCharactersQuery(campaignId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-neon-cyan-500/30 border-t-neon-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-neon-magenta-500/10 border-neon-magenta-500/30 text-center py-6">
        <p className="text-neon-magenta-400 text-sm">Erreur de chargement</p>
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return (
      <div className="card bg-cyber-dark-900/50 border-cyber-dark-700 text-center py-8">
        <p className="text-cyber-dark-500">Aucun personnage lié à cette campagne</p>
        <p className="text-xs text-cyber-dark-600 mt-2">
          Les joueurs peuvent lier leurs personnages depuis leur page de campagne
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((character) => (
        <CharacterCard key={character._id} character={character} />
      ))}
    </div>
  );
}

function CharacterCard({ character }: { character: CampaignCharacter }) {
  const hpPercent = (character.currentHitPoints / character.maxHitPoints) * 100;
  const maxHumanity = character.stats.empathy * 10;
  const humPercent = (character.humanity / maxHumanity) * 100;

  return (
    <Link
      href={`/characters/${character._id}?readonly=true`}
      className="card card-glow group relative"
    >
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />
      <div className="corner-decoration bottom-left" />
      <div className="corner-decoration bottom-right" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-lg bg-cyber-dark-800 border border-cyber-dark-600 overflow-hidden flex-shrink-0 relative">
          {character.portraitUrl ? (
            <Image
              src={character.portraitUrl}
              alt={character.handle}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-cyber font-semibold text-white group-hover:text-neon-cyan-400 transition-colors truncate">
            {character.handle}
          </h4>
          <p className="text-sm text-neon-violet-400">{character.role}</p>

          {/* HP & Humanity bars */}
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyber-dark-500">HP</span>
                <span className="text-neon-cyan-400">
                  {character.currentHitPoints}/{character.maxHitPoints}
                </span>
              </div>
              <div className="h-1.5 bg-cyber-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan-500 to-neon-cyan-400 rounded-full transition-all"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyber-dark-500">HUM</span>
                <span className="text-neon-violet-400">
                  {character.humanity}/{maxHumanity}
                </span>
              </div>
              <div className="h-1.5 bg-cyber-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-violet-500 to-neon-magenta-400 rounded-full transition-all"
                  style={{ width: `${humPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View indicator */}
      <div className="absolute top-3 right-3 text-xs text-cyber-dark-500 group-hover:text-neon-cyan-400 transition-colors">
        Voir →
      </div>
    </Link>
  );
}
