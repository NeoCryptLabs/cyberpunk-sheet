'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useLinkCharacterToCampaignMutation,
  useUnlinkCharacterFromCampaignMutation,
  Campaign,
} from '@/store/services/campaign-api';
import { useGetMyCharactersQuery } from '@/store/services/character-api';

interface LinkCharacterSelectorProps {
  campaign: Campaign;
}

export function LinkCharacterSelector({ campaign }: LinkCharacterSelectorProps) {
  const { data: myCharacters, isLoading: isLoadingCharacters } = useGetMyCharactersQuery();
  const [linkCharacter, { isLoading: isLinking }] = useLinkCharacterToCampaignMutation();
  const [unlinkCharacter, { isLoading: isUnlinking }] = useUnlinkCharacterFromCampaignMutation();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');

  const linkedCharacterIds = new Set(campaign.characterIds);
  const availableCharacters = myCharacters?.filter((c) => !linkedCharacterIds.has(c._id)) ?? [];
  const myLinkedCharacters = myCharacters?.filter((c) => linkedCharacterIds.has(c._id)) ?? [];

  const handleLink = async () => {
    if (!selectedCharacterId) return;
    try {
      await linkCharacter({
        campaignId: campaign._id,
        characterId: selectedCharacterId,
      }).unwrap();
      setSelectedCharacterId('');
    } catch (err) {
      console.error('Failed to link character:', err);
    }
  };

  const handleUnlink = async (characterId: string) => {
    if (!confirm('Retirer ce personnage de la campagne ?')) return;
    try {
      await unlinkCharacter({
        campaignId: campaign._id,
        characterId,
      }).unwrap();
    } catch (err) {
      console.error('Failed to unlink character:', err);
    }
  };

  if (isLoadingCharacters) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-neon-cyan-500/30 border-t-neon-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* My linked characters */}
      {myLinkedCharacters.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-cyber-dark-400 mb-2">
            Mes personnages dans cette campagne
          </h4>
          <div className="space-y-2">
            {myLinkedCharacters.map((character) => (
              <div
                key={character._id}
                className="flex items-center justify-between p-3 rounded-lg bg-cyber-dark-950 border border-neon-cyan-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-cyan-500/20 flex items-center justify-center overflow-hidden relative">
                    {character.portraitUrl ? (
                      <Image
                        src={character.portraitUrl}
                        alt={character.handle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-neon-cyan-400">👤</span>
                    )}
                  </div>
                  <div>
                    <span className="text-white font-medium">{character.handle}</span>
                    <span className="text-xs text-neon-violet-400 ml-2">{character.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUnlink(character._id)}
                  disabled={isUnlinking}
                  className="text-neon-magenta-400/70 hover:text-neon-magenta-400 text-sm px-3 py-1"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add a character */}
      {availableCharacters.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium text-cyber-dark-400 mb-2">
            Ajouter un personnage
          </h4>
          <div className="flex gap-2">
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className="input-field flex-1 h-12"
            >
              <option value="">Sélectionner un personnage</option>
              {availableCharacters.map((character) => (
                <option key={character._id} value={character._id}>
                  {character.handle} ({character.role})
                </option>
              ))}
            </select>
            <button
              onClick={handleLink}
              disabled={!selectedCharacterId || isLinking}
              className="btn-primary font-cyber h-12 px-6"
            >
              {isLinking ? '...' : 'Lier'}
            </button>
          </div>
        </div>
      ) : myLinkedCharacters.length === 0 ? (
        <p className="text-sm text-cyber-dark-500">
          Vous n&apos;avez pas encore de personnage.{' '}
          <a href="/characters" className="text-neon-cyan-400 hover:underline">
            Créez-en un
          </a>
        </p>
      ) : null}
    </div>
  );
}
