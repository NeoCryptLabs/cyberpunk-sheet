'use client';

import { useState } from 'react';
import { useJoinCampaignMutation } from '@/store/services/campaign-api';

interface JoinCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinCampaignModal({ isOpen, onClose }: JoinCampaignModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [joinCampaign, { isLoading }] = useJoinCampaignMutation();

  const handleSubmit = async () => {
    if (!inviteCode.trim()) return;

    setError(null);
    try {
      await joinCampaign({ inviteCode: inviteCode.trim().toUpperCase() }).unwrap();
      setInviteCode('');
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { message?: string } }).data?.message || 'Code invalide ou expiré')
          : 'Code invalide ou expiré';
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="card card-glow w-full sm:max-w-md relative rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />

        {/* Mobile drag indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4" />

        <h2 className="text-xl md:text-2xl font-cyber font-bold mb-5 md:mb-6 bg-gradient-to-r from-neon-cyan-400 to-neon-violet-400 bg-clip-text text-transparent">
          Rejoindre une campagne
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
              Code d&apos;invitation
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase());
                setError(null);
              }}
              className="input-field w-full h-12 text-center font-mono text-lg tracking-widest uppercase"
              placeholder="ABC123"
              maxLength={6}
            />
            <p className="text-xs text-cyber-dark-500 mt-2">
              Demandez le code à votre MJ
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-neon-magenta-500/10 border border-neon-magenta-500/30">
              <p className="text-sm text-neon-magenta-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 pb-safe">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 font-cyber min-h-[48px]"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || inviteCode.length !== 6}
              className="btn-primary flex-1 font-cyber min-h-[48px]"
            >
              {isLoading ? 'Connexion...' : 'Rejoindre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
