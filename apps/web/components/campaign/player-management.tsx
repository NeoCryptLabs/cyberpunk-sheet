'use client';

import { useState } from 'react';
import {
  useGenerateInviteCodeMutation,
  useRemovePlayerMutation,
  Campaign,
} from '@/store/services/campaign-api';

interface PlayerManagementProps {
  campaign: Campaign;
  currentUserId: string;
}

export function PlayerManagement({ campaign, currentUserId }: PlayerManagementProps) {
  const [generateInviteCode, { isLoading: isGenerating }] = useGenerateInviteCodeMutation();
  const [removePlayer, { isLoading: isRemoving }] = useRemovePlayerMutation();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);

  const isGameMaster = campaign.gameMasterId === currentUserId;

  const handleGenerateCode = async () => {
    try {
      const code = await generateInviteCode({ campaignId: campaign._id }).unwrap();
      setInviteCode(code);
      setCopied(false);
    } catch (err) {
      console.error('Failed to generate invite code:', err);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRemovePlayer = async (userId: string) => {
    if (!confirm('Retirer ce joueur de la campagne ?')) return;

    setRemovingPlayerId(userId);
    try {
      await removePlayer({ campaignId: campaign._id, userId }).unwrap();
    } catch (err) {
      console.error('Failed to remove player:', err);
    } finally {
      setRemovingPlayerId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Section (GM only) */}
      {isGameMaster && (
        <div className="card bg-cyber-dark-900/50 border-neon-cyan-500/20">
          <h3 className="text-lg font-cyber font-semibold text-neon-cyan-400 mb-4">
            Inviter des joueurs
          </h3>

          {inviteCode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 bg-cyber-dark-950 rounded-lg border border-neon-cyan-500/30 text-center">
                  <span className="font-mono text-2xl tracking-widest text-neon-cyan-400">
                    {inviteCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="btn-secondary h-14 px-4 font-cyber"
                >
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
              <p className="text-xs text-cyber-dark-500">
                Ce code expire dans 24h ou après utilisation
              </p>
              <button
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="text-sm text-neon-cyan-400/70 hover:text-neon-cyan-400"
              >
                Générer un nouveau code
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="btn-primary font-cyber min-h-[48px] w-full"
            >
              {isGenerating ? 'Génération...' : 'Générer un code d\'invitation'}
            </button>
          )}
        </div>
      )}

      {/* Players List */}
      <div className="card bg-cyber-dark-900/50 border-neon-violet-500/20">
        <h3 className="text-lg font-cyber font-semibold text-neon-violet-400 mb-4">
          Joueurs ({campaign.playerIds.length})
        </h3>

        {campaign.playerIds.length === 0 ? (
          <p className="text-cyber-dark-500 text-sm">Aucun joueur dans cette campagne</p>
        ) : (
          <div className="space-y-2">
            {campaign.playerIds.map((playerId) => (
              <div
                key={playerId}
                className="flex items-center justify-between p-3 rounded-lg bg-cyber-dark-950 border border-cyber-dark-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-violet-500/20 flex items-center justify-center">
                    <span className="text-neon-violet-400">👤</span>
                  </div>
                  <span className="text-white font-mono text-sm truncate">
                    {playerId.slice(-8)}
                  </span>
                </div>

                {isGameMaster && (
                  <button
                    onClick={() => handleRemovePlayer(playerId)}
                    disabled={isRemoving && removingPlayerId === playerId}
                    className="text-neon-magenta-400/70 hover:text-neon-magenta-400 text-sm px-3 py-1"
                  >
                    {removingPlayerId === playerId ? '...' : 'Retirer'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
