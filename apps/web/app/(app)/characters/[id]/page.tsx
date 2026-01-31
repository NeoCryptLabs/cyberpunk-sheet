'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';

import {
  useGetCharacterQuery,
  useTakeDamageMutation,
  useHealCharacterMutation,
  useSpendLuckMutation,
  useRestoreLuckMutation,
  useDeleteCharacterMutation,
  useUpdateCharacterMutation,
  Character,
} from '@/store/services/character-api';
import {
  WEAPON_TEMPLATES,
  ARMOR_TEMPLATES,
  CYBERWARE_TEMPLATES,
  CYBERWARE_TYPE_LABELS,
  INSTALLATION_LABELS,
  WEAPON_TYPE_LABELS,
  ARMOR_TYPE_LABELS,
} from '@/lib/cyberpunk-data';

// Stat abbreviation mapping
const STAT_ABBREV: Record<string, string> = {
  intelligence: 'INT',
  reflexes: 'REF',
  dexterity: 'DEX',
  technology: 'TECH',
  cool: 'COOL',
  willpower: 'WILL',
  luck: 'LUCK',
  move: 'MOVE',
  body: 'BODY',
  empathy: 'EMP',
};

export default function CharacterDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isReadOnly = searchParams.get('readonly') === 'true';
  const t = useTranslations();
  const router = useRouter();
  const { data: character, isLoading, error } = useGetCharacterQuery(id);
  const [takeDamage] = useTakeDamageMutation();
  const [healCharacter] = useHealCharacterMutation();
  const [spendLuck] = useSpendLuckMutation();
  const [restoreLuck] = useRestoreLuckMutation();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const [updateCharacter] = useUpdateCharacterMutation();

  const [damageAmount, setDamageAmount] = useState(1);
  const [healAmount, setHealAmount] = useState(1);
  const [luckAmount, setLuckAmount] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'gear' | 'lifepath'>('stats');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-neon-magenta-500/30 border-t-neon-magenta-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="p-4 md:p-8">
        <div className="card border-neon-magenta-500/30 text-center py-8">
          <p className="text-neon-magenta-400">{t('common.error')}</p>
          <p className="text-cyber-dark-500 text-sm mt-2">Personnage non trouvé</p>
          <Link href="/characters" className="btn-primary mt-4 inline-block">
            Retour aux personnages
          </Link>
        </div>
      </div>
    );
  }

  const hpPercentage = (character.currentHitPoints / character.maxHitPoints) * 100;
  const humanityPercentage = (character.humanity / (character.stats.empathy * 10)) * 100;

  const handleTakeDamage = async () => {
    if (damageAmount > 0) {
      await takeDamage({ id, damage: damageAmount });
    }
  };

  const handleHeal = async () => {
    if (healAmount > 0) {
      await healCharacter({ id, amount: healAmount });
    }
  };

  const handleSpendLuck = async () => {
    if (luckAmount > 0 && luckAmount <= character.currentLuck) {
      await spendLuck({ id, amount: luckAmount });
    }
  };

  const handleRestoreLuck = async () => {
    await restoreLuck(id);
  };

  const handleDelete = async () => {
    await deleteCharacter(id);
    router.push('/characters');
  };

  return (
    <div className="p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <Link href="/characters" className="text-cyber-dark-500 hover:text-neon-magenta-400 text-sm mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <h1 className="text-2xl md:text-3xl font-cyber font-bold bg-gradient-to-r from-neon-magenta-400 to-neon-violet-400 bg-clip-text text-transparent">
            {character.handle}
          </h1>
          {character.realName && (
            <p className="text-cyber-dark-400 text-sm">{character.realName}</p>
          )}
        </div>
        {!isReadOnly && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href={`/characters/${id}/edit`} className="btn-secondary flex-1 sm:flex-none font-cyber min-h-[44px] flex items-center justify-center">
              Modifier
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-secondary flex-1 sm:flex-none font-cyber min-h-[44px] text-neon-magenta-400 border-neon-magenta-500/30 hover:bg-neon-magenta-500/10"
            >
              Supprimer
            </button>
          </div>
        )}
        {isReadOnly && (
          <div className="px-3 py-1 bg-neon-cyan-500/20 border border-neon-cyan-500/30 rounded-full text-sm font-medium text-neon-cyan-400">
            Vue MJ (lecture seule)
          </div>
        )}
      </div>

      {/* Role & Level Badge */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-gradient-to-r from-neon-magenta-600 to-neon-violet-600 rounded-full text-sm font-medium">
          {character.role}
        </span>
        <span className="px-3 py-1 bg-cyber-dark-800 border border-neon-cyan-500/30 rounded-full text-sm font-medium text-neon-cyan-400">
          Niveau {character.level}
        </span>
        <span className="px-3 py-1 bg-cyber-dark-800 border border-green-500/30 rounded-full text-sm font-medium text-green-400">
          {character.eurodollars} €$
        </span>
      </div>

      {/* HP & Humanity Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* HP Card */}
        <div className="card card-glow relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-cyber text-neon-magenta-400">Points de Vie</h3>
            <span className="font-mono text-lg">
              {character.currentHitPoints}/{character.maxHitPoints}
            </span>
          </div>
          <div className="hp-bar mb-4">
            <div
              className={`hp-bar-fill ${hpPercentage > 50 ? 'high' : hpPercentage > 25 ? 'medium' : 'low'}`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          {!isReadOnly && (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={damageAmount}
                onChange={(e) => setDamageAmount(parseInt(e.target.value) || 1)}
                className="input-field w-16 h-10 text-center"
              />
              <button onClick={handleTakeDamage} className="btn-secondary flex-1 text-neon-magenta-400 min-h-[40px]">
                Dégâts
              </button>
              <input
                type="number"
                min="1"
                value={healAmount}
                onChange={(e) => setHealAmount(parseInt(e.target.value) || 1)}
                className="input-field w-16 h-10 text-center"
              />
              <button onClick={handleHeal} className="btn-secondary flex-1 text-green-400 min-h-[40px]">
                Soins
              </button>
            </div>
          )}
          <div className="mt-3 text-xs text-cyber-dark-500 flex justify-between">
            <span>Blessé grave: {character.seriouslyWoundedThreshold}</span>
            <span>Death Save: {character.deathSave}</span>
          </div>
        </div>

        {/* Luck Card */}
        <div className="card card-glow relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-cyber text-neon-cyan-400">Chance</h3>
            <span className="font-mono text-lg">
              {character.currentLuck}/{character.stats.luck}
            </span>
          </div>
          <div className="h-3 rounded-full bg-cyber-dark-800 border border-cyber-dark-700 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan-500 to-neon-cyan-400 transition-all"
              style={{ width: `${(character.currentLuck / character.stats.luck) * 100}%` }}
            />
          </div>
          {!isReadOnly && (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max={character.currentLuck}
                value={luckAmount}
                onChange={(e) => setLuckAmount(parseInt(e.target.value) || 1)}
                className="input-field w-16 h-10 text-center"
              />
              <button onClick={handleSpendLuck} className="btn-secondary flex-1 text-neon-cyan-400 min-h-[40px]">
                Dépenser
              </button>
              <button onClick={handleRestoreLuck} className="btn-secondary flex-1 text-green-400 min-h-[40px]">
                Restaurer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Humanity */}
      <div className="card card-glow relative mb-6">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-cyber text-neon-violet-400">Humanité</h3>
          <span className="font-mono text-lg">
            {character.humanity}/{character.stats.empathy * 10}
          </span>
        </div>
        <div className="h-3 rounded-full bg-cyber-dark-800 border border-cyber-dark-700 overflow-hidden">
          <div
            className={`h-full transition-all ${humanityPercentage > 50 ? 'bg-gradient-to-r from-neon-violet-500 to-neon-violet-400' : humanityPercentage > 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
            style={{ width: `${humanityPercentage}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {(['stats', 'skills', 'gear', 'lifepath'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-cyber text-sm whitespace-nowrap min-h-[44px] transition-all ${
              activeTab === tab
                ? 'bg-neon-violet-500/20 text-neon-violet-400 border border-neon-violet-500/50'
                : 'bg-cyber-dark-800 text-cyber-dark-400 border border-cyber-dark-700 active:bg-cyber-dark-700'
            }`}
          >
            {tab === 'stats' && 'Statistiques'}
            {tab === 'skills' && 'Compétences'}
            {tab === 'gear' && 'Équipement'}
            {tab === 'lifepath' && 'Lifepath'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <StatsTab character={character} />}
      {activeTab === 'skills' && <SkillsTab character={character} characterId={id} updateCharacter={updateCharacter} />}
      {activeTab === 'gear' && <GearTab character={character} characterId={id} updateCharacter={updateCharacter} />}
      {activeTab === 'lifepath' && <LifepathTab character={character} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card card-glow max-w-md w-full relative">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <h2 className="text-xl font-cyber font-bold text-neon-magenta-400 mb-4">
              Confirmer la suppression
            </h2>
            <p className="text-cyber-dark-300 mb-6">
              Voulez-vous vraiment supprimer <span className="text-white font-semibold">{character.handle}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1 min-h-[44px]"
              >
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

function StatsTab({ character }: { character: Character }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <h3 className="font-cyber text-lg mb-4 text-neon-cyan-400">Statistiques</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(character.stats).map(([key, value]) => (
            <div key={key} className="stat-box p-3 text-center">
              <p className="stat-label text-xs mb-1">{STAT_ABBREV[key] || key.toUpperCase()}</p>
              <p className="stat-value text-xl">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Ability */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <h3 className="font-cyber text-lg mb-4 text-neon-magenta-400">Capacité de Rôle</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-white">{character.roleAbility.name}</span>
          <span className="px-2 py-1 bg-neon-magenta-500/20 text-neon-magenta-400 rounded text-sm">
            Rang {character.roleAbility.rank}
          </span>
        </div>
        {character.roleAbility.description && (
          <p className="text-cyber-dark-400 text-sm">{character.roleAbility.description}</p>
        )}
        {character.roleAbility.specializations && character.roleAbility.specializations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {character.roleAbility.specializations.map((spec, i) => (
              <span key={i} className="px-2 py-1 bg-cyber-dark-800 text-cyber-dark-300 rounded text-xs">
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Improvement Points */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="flex justify-between items-center">
          <h3 className="font-cyber text-neon-violet-400">Points d&apos;Amélioration</h3>
          <span className="font-mono text-2xl text-white">{character.improvementPoints}</span>
        </div>
      </div>
    </div>
  );
}

interface SkillsTabProps {
  character: Character;
  characterId: string;
  updateCharacter: ReturnType<typeof useUpdateCharacterMutation>[0];
}

function SkillsTab({ character, characterId, updateCharacter }: SkillsTabProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Group skills by linked stat
  const skillsByStatRaw: Record<string, typeof character.skills> = {};
  character.skills.forEach((skill) => {
    if (!skillsByStatRaw[skill.linkedStat]) {
      skillsByStatRaw[skill.linkedStat] = [];
    }
    skillsByStatRaw[skill.linkedStat]!.push(skill);
  });

  // Sort skills within each group
  Object.values(skillsByStatRaw).forEach((skills) => {
    skills.sort((a, b) => a.name.localeCompare(b.name));
  });

  const handleSkillLevelChange = async (skillName: string, delta: number) => {
    const skillKey = `${skillName}`;
    setIsUpdating(skillKey);

    const updatedSkills = character.skills.map((skill) => {
      if (skill.name === skillName) {
        const newLevel = Math.max(0, Math.min(10, skill.level + delta));
        return { ...skill, level: newLevel };
      }
      return skill;
    });

    try {
      await updateCharacter({ id: characterId, skills: updatedSkills });
    } catch (err) {
      console.error('Failed to update skill:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (character.skills.length === 0) {
    return (
      <div className="card card-glow text-center py-8 relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <p className="text-cyber-dark-400">Aucune compétence enregistrée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(skillsByStatRaw).map(([stat, skills]) => (
        <div key={stat} className="card card-glow relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <h3 className="font-cyber text-sm mb-3 text-neon-cyan-400">{STAT_ABBREV[stat.toLowerCase()] || stat}</h3>
          <div className="space-y-1">
            {skills.map((skill, i) => {
              const isThisUpdating = isUpdating === skill.name;
              return (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 px-2 -mx-2 rounded-lg border border-transparent hover:border-cyber-dark-700 hover:bg-cyber-dark-800/50 transition-all group"
                >
                  <span className="text-sm text-cyber-dark-300 truncate flex-1 mr-2">{skill.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSkillLevelChange(skill.name, -1)}
                      disabled={skill.level <= 0 || isThisUpdating}
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-cyber-dark-800 text-cyber-dark-400 hover:text-neon-magenta-400 hover:bg-cyber-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 active:scale-95"
                      aria-label="Diminuer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className={`font-mono text-white w-8 text-center ${isThisUpdating ? 'animate-pulse' : ''}`}>
                      {skill.level}
                    </span>
                    <button
                      onClick={() => handleSkillLevelChange(skill.name, 1)}
                      disabled={skill.level >= 10 || isThisUpdating}
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-cyber-dark-800 text-cyber-dark-400 hover:text-neon-cyan-400 hover:bg-cyber-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 active:scale-95"
                      aria-label="Augmenter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface GearTabProps {
  character: Character;
  characterId: string;
  updateCharacter: ReturnType<typeof useUpdateCharacterMutation>[0];
}

function GearTab({ character, characterId, updateCharacter }: GearTabProps) {
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [showArmorModal, setShowArmorModal] = useState(false);
  const [showCyberwareModal, setShowCyberwareModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weaponSearch, setWeaponSearch] = useState('');
  const [armorSearch, setArmorSearch] = useState('');
  const [cyberwareSearch, setCyberwareSearch] = useState('');

  // Filtered lists
  const filteredWeapons = useMemo(() => {
    if (!weaponSearch.trim()) return WEAPON_TEMPLATES;
    const search = weaponSearch.toLowerCase();
    return WEAPON_TEMPLATES.filter(
      (w) => w.name.toLowerCase().includes(search) || w.type.toLowerCase().includes(search) || w.skill.toLowerCase().includes(search)
    );
  }, [weaponSearch]);

  const filteredArmor = useMemo(() => {
    if (!armorSearch.trim()) return ARMOR_TEMPLATES;
    const search = armorSearch.toLowerCase();
    return ARMOR_TEMPLATES.filter(
      (a) => a.name.toLowerCase().includes(search) || a.type.toLowerCase().includes(search)
    );
  }, [armorSearch]);

  const filteredCyberware = useMemo(() => {
    if (!cyberwareSearch.trim()) return CYBERWARE_TEMPLATES;
    const search = cyberwareSearch.toLowerCase();
    return CYBERWARE_TEMPLATES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.type.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.installation.toLowerCase().includes(search)
    );
  }, [cyberwareSearch]);

  const handleAddWeapon = async (weaponName: string) => {
    const weapon = WEAPON_TEMPLATES.find((w) => w.name === weaponName);
    if (!weapon) return;

    setIsUpdating(true);
    try {
      await updateCharacter({
        id: characterId,
        weapons: [...character.weapons, weapon],
      });
      setShowWeaponModal(false);
    } catch (err) {
      console.error('Failed to add weapon:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveWeapon = async (index: number) => {
    setIsUpdating(true);
    try {
      const updatedWeapons = character.weapons.filter((_, i) => i !== index);
      await updateCharacter({ id: characterId, weapons: updatedWeapons });
    } catch (err) {
      console.error('Failed to remove weapon:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddArmor = async (armorName: string) => {
    const armor = ARMOR_TEMPLATES.find((a) => a.name === armorName);
    if (!armor) return;

    setIsUpdating(true);
    try {
      await updateCharacter({
        id: characterId,
        armor: [...character.armor, armor],
      });
      setShowArmorModal(false);
    } catch (err) {
      console.error('Failed to add armor:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveArmor = async (index: number) => {
    setIsUpdating(true);
    try {
      const updatedArmor = character.armor.filter((_, i) => i !== index);
      await updateCharacter({ id: characterId, armor: updatedArmor });
    } catch (err) {
      console.error('Failed to remove armor:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddCyberware = async (cyberwareName: string) => {
    const cyberware = CYBERWARE_TEMPLATES.find((c) => c.name === cyberwareName);
    if (!cyberware) return;

    setIsUpdating(true);
    try {
      await updateCharacter({
        id: characterId,
        cyberware: [...character.cyberware, cyberware],
      });
      setShowCyberwareModal(false);
    } catch (err) {
      console.error('Failed to add cyberware:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveCyberware = async (index: number) => {
    setIsUpdating(true);
    try {
      const updatedCyberware = character.cyberware.filter((_, i) => i !== index);
      await updateCharacter({ id: characterId, cyberware: updatedCyberware });
    } catch (err) {
      console.error('Failed to remove cyberware:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Weapons */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-cyber text-lg text-neon-magenta-400">Armes</h3>
          <button
            onClick={() => setShowWeaponModal(true)}
            disabled={isUpdating}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-neon-magenta-500/20 text-neon-magenta-400 hover:bg-neon-magenta-500/30 active:scale-95 transition-all disabled:opacity-50"
            aria-label="Ajouter une arme"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {character.weapons.length > 0 ? (
          <div className="space-y-3">
            {character.weapons.map((weapon, i) => (
              <div key={i} className="p-3 bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{weapon.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neon-magenta-500/20 text-neon-magenta-400 rounded text-xs">
                      {weapon.type}
                    </span>
                    <button
                      onClick={() => handleRemoveWeapon(i)}
                      disabled={isUpdating}
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-cyber-dark-500 hover:text-neon-magenta-400 hover:bg-neon-magenta-500/10 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-50 active:scale-95"
                      aria-label="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-cyber-dark-500">Dégâts: </span>
                    <span className="text-white">{weapon.damage}</span>
                  </div>
                  <div>
                    <span className="text-cyber-dark-500">CdT: </span>
                    <span className="text-white">{weapon.rof}</span>
                  </div>
                  {weapon.magazine && (
                    <div>
                      <span className="text-cyber-dark-500">Mag: </span>
                      <span className="text-white">{weapon.magazine}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyber-dark-400 text-sm">Aucune arme</p>
        )}
      </div>

      {/* Armor */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-cyber text-lg text-neon-cyan-400">Armures</h3>
          <button
            onClick={() => setShowArmorModal(true)}
            disabled={isUpdating}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-neon-cyan-500/20 text-neon-cyan-400 hover:bg-neon-cyan-500/30 active:scale-95 transition-all disabled:opacity-50"
            aria-label="Ajouter une armure"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {character.armor.length > 0 ? (
          <div className="space-y-3">
            {character.armor.map((armor, i) => (
              <div key={i} className="p-3 bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 group">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{armor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-cyber-dark-700 text-cyber-dark-300 rounded text-xs">
                      {armor.type}
                    </span>
                    <span className="px-2 py-0.5 bg-neon-cyan-500/20 text-neon-cyan-400 rounded text-xs">
                      SP {armor.stoppingPower}
                    </span>
                    <button
                      onClick={() => handleRemoveArmor(i)}
                      disabled={isUpdating}
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-cyber-dark-500 hover:text-neon-magenta-400 hover:bg-neon-magenta-500/10 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-50 active:scale-95"
                      aria-label="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {armor.penalty && armor.penalty < 0 && (
                  <p className="text-xs text-cyber-dark-500 mt-1">Pénalité: {armor.penalty}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyber-dark-400 text-sm">Aucune armure</p>
        )}
      </div>

      {/* Cyberware */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-cyber text-lg text-neon-violet-400">Cyberware</h3>
          <button
            onClick={() => setShowCyberwareModal(true)}
            disabled={isUpdating}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-neon-violet-500/20 text-neon-violet-400 hover:bg-neon-violet-500/30 active:scale-95 transition-all disabled:opacity-50"
            aria-label="Ajouter du cyberware"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {character.cyberware.length > 0 ? (
          <div className="space-y-3">
            {character.cyberware.map((cyber, i) => (
              <div key={i} className="p-3 bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{cyber.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neon-violet-500/20 text-neon-violet-400 rounded text-xs">
                      {cyber.type}
                    </span>
                    <button
                      onClick={() => handleRemoveCyberware(i)}
                      disabled={isUpdating}
                      className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-cyber-dark-500 hover:text-neon-magenta-400 hover:bg-neon-magenta-500/10 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-50 active:scale-95"
                      aria-label="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-cyber-dark-400 text-sm mb-2">{cyber.description}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-cyber-dark-500">HL: <span className="text-neon-magenta-400">{cyber.humanityLoss}</span></span>
                  <span className="text-cyber-dark-500">Coût: <span className="text-green-400">{cyber.cost}€$</span></span>
                  <span className="text-cyber-dark-500">Installation: <span className="text-white">{cyber.installation}</span></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyber-dark-400 text-sm">Aucun cyberware</p>
        )}
      </div>

      {/* Inventory */}
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <h3 className="font-cyber text-lg mb-4 text-green-400">Inventaire</h3>
        {character.inventory.length > 0 ? (
          <div className="space-y-2">
            {character.inventory.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-cyber-dark-700 last:border-0">
                <div>
                  <span className="text-white">{item.name}</span>
                  {item.description && <p className="text-cyber-dark-500 text-xs">{item.description}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  <span className="px-2 py-0.5 bg-cyber-dark-800 text-cyber-dark-300 rounded text-xs">
                    x{item.quantity}
                  </span>
                  {item.cost && (
                    <span className="text-green-400 text-xs">{item.cost}€$</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyber-dark-400 text-sm">Inventaire vide</p>
        )}
      </div>

      {/* Add Weapon Modal */}
      {showWeaponModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="card card-glow w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col relative rounded-t-2xl sm:rounded-xl overflow-hidden">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />

            {/* Mobile drag indicator */}
            <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4 flex-shrink-0" />

            <h2 className="text-xl font-cyber font-bold mb-3 text-neon-magenta-400 flex-shrink-0">
              Ajouter une arme
            </h2>

            {/* Search */}
            <div className="mb-3 flex-shrink-0">
              <input
                type="text"
                value={weaponSearch}
                onChange={(e) => setWeaponSearch(e.target.value)}
                placeholder="Rechercher une arme..."
                className="input-field w-full h-11"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredWeapons.length > 0 ? (
                  filteredWeapons.map((weapon) => (
                    <button
                      key={weapon.name}
                      onClick={() => handleAddWeapon(weapon.name)}
                      disabled={isUpdating}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-magenta-500/50 active:bg-cyber-dark-700 transition-all disabled:opacity-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{weapon.name}</span>
                        <span className="text-neon-magenta-400 text-sm">{weapon.damage}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-cyber-dark-400">
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 rounded">{WEAPON_TYPE_LABELS[weapon.type] || weapon.type}</span>
                        <span>CdT {weapon.rof}</span>
                        {weapon.magazine && <span>Mag {weapon.magazine}</span>}
                        {weapon.concealable && <span className="text-green-400">Dissimulable</span>}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-cyber-dark-500 py-8">Aucun résultat</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 pt-3 border-t border-cyber-dark-700 -mx-4 px-4 pb-safe">
              <button
                onClick={() => { setShowWeaponModal(false); setWeaponSearch(''); }}
                className="btn-secondary w-full min-h-[48px]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Armor Modal */}
      {showArmorModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="card card-glow w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col relative rounded-t-2xl sm:rounded-xl overflow-hidden">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />

            {/* Mobile drag indicator */}
            <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4 flex-shrink-0" />

            <h2 className="text-xl font-cyber font-bold mb-3 text-neon-cyan-400 flex-shrink-0">
              Ajouter une armure
            </h2>

            {/* Search */}
            <div className="mb-3 flex-shrink-0">
              <input
                type="text"
                value={armorSearch}
                onChange={(e) => setArmorSearch(e.target.value)}
                placeholder="Rechercher une armure..."
                className="input-field w-full h-11"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredArmor.length > 0 ? (
                  filteredArmor.map((armor) => (
                    <button
                      key={armor.name}
                      onClick={() => handleAddArmor(armor.name)}
                      disabled={isUpdating}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-cyan-500/50 active:bg-cyber-dark-700 transition-all disabled:opacity-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{armor.name}</span>
                        <span className="text-neon-cyan-400 text-sm">SP {armor.stoppingPower}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-cyber-dark-400">
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 rounded">{ARMOR_TYPE_LABELS[armor.type] || armor.type}</span>
                        {armor.penalty < 0 && <span className="text-neon-magenta-400">Pénalité: {armor.penalty}</span>}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-cyber-dark-500 py-8">Aucun résultat</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 pt-3 border-t border-cyber-dark-700 -mx-4 px-4 pb-safe">
              <button
                onClick={() => { setShowArmorModal(false); setArmorSearch(''); }}
                className="btn-secondary w-full min-h-[48px]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Cyberware Modal */}
      {showCyberwareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="card card-glow w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col relative rounded-t-2xl sm:rounded-xl overflow-hidden">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />

            {/* Mobile drag indicator */}
            <div className="sm:hidden w-12 h-1.5 bg-cyber-dark-600 rounded-full mx-auto mb-4 flex-shrink-0" />

            <h2 className="text-xl font-cyber font-bold mb-3 text-neon-violet-400 flex-shrink-0">
              Ajouter du cyberware
            </h2>

            {/* Search */}
            <div className="mb-3 flex-shrink-0">
              <input
                type="text"
                value={cyberwareSearch}
                onChange={(e) => setCyberwareSearch(e.target.value)}
                placeholder="Rechercher un cyberware..."
                className="input-field w-full h-11"
                autoFocus
              />
            </div>

            {/* Results count */}
            <p className="text-cyber-dark-500 text-xs mb-2 flex-shrink-0">
              {filteredCyberware.length} résultat{filteredCyberware.length > 1 ? 's' : ''}
            </p>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredCyberware.length > 0 ? (
                  filteredCyberware.map((cyber) => (
                    <button
                      key={cyber.name}
                      onClick={() => handleAddCyberware(cyber.name)}
                      disabled={isUpdating}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-violet-500/50 active:bg-cyber-dark-700 transition-all disabled:opacity-50"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-semibold text-white">{cyber.name}</span>
                        <span className="text-neon-magenta-400 text-sm whitespace-nowrap">-{cyber.humanityLoss} HL</span>
                      </div>
                      <p className="text-cyber-dark-400 text-xs mb-2">{cyber.description}</p>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span className="px-1.5 py-0.5 bg-neon-violet-500/20 text-neon-violet-400 rounded">
                          {CYBERWARE_TYPE_LABELS[cyber.type] || cyber.type}
                        </span>
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                          {cyber.cost}€$
                        </span>
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 text-cyber-dark-300 rounded">
                          {INSTALLATION_LABELS[cyber.installation] || cyber.installation}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-cyber-dark-500 py-8">Aucun résultat</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 pt-3 border-t border-cyber-dark-700 -mx-4 px-4 pb-safe">
              <button
                onClick={() => { setShowCyberwareModal(false); setCyberwareSearch(''); }}
                className="btn-secondary w-full min-h-[48px]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LifepathTab({ character }: { character: Character }) {
  const lifepath = character.lifepath;

  if (!lifepath) {
    return (
      <div className="card card-glow text-center py-8 relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <p className="text-cyber-dark-400">Aucun lifepath enregistré</p>
      </div>
    );
  }

  const sections = [
    { label: 'Origine Culturelle', value: lifepath.culturalOrigin },
    { label: 'Personnalité', value: lifepath.personality },
    { label: 'Style Vestimentaire', value: lifepath.clothingStyle },
    { label: 'Coiffure', value: lifepath.hairstyle },
    { label: 'Ce que tu valorises le plus', value: lifepath.valueMost },
    { label: 'Ton opinion sur les gens', value: lifepath.feelingsAboutPeople },
    { label: 'Personne la plus importante', value: lifepath.valuedPerson },
    { label: 'Possession la plus précieuse', value: lifepath.valuedPossession },
    { label: 'Background Familial', value: lifepath.familyBackground },
    { label: 'Environnement d\'enfance', value: lifepath.childhoodEnvironment },
    { label: 'Crise Familiale', value: lifepath.familyCrisis },
  ];

  const listSections = [
    { label: 'Objectifs de vie', values: lifepath.lifeGoals },
    { label: 'Amis', values: lifepath.friends },
    { label: 'Ennemis', values: lifepath.enemies },
    { label: 'Relations amoureuses', values: lifepath.romanticInvolvements },
  ];

  return (
    <div className="space-y-4">
      <div className="card card-glow relative">
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <h3 className="font-cyber text-lg mb-4 text-neon-violet-400">Histoire Personnelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, i) =>
            section.value ? (
              <div key={i}>
                <p className="text-cyber-dark-500 text-xs mb-1">{section.label}</p>
                <p className="text-white">{section.value}</p>
              </div>
            ) : null
          )}
        </div>
      </div>

      {listSections.map((section, i) =>
        section.values && section.values.length > 0 ? (
          <div key={i} className="card card-glow relative">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <h3 className="font-cyber text-lg mb-4 text-neon-cyan-400">{section.label}</h3>
            <ul className="space-y-2">
              {section.values.map((item, j) => (
                <li key={j} className="text-cyber-dark-300 pl-4 border-l-2 border-neon-cyan-500/30">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}

      {/* Notes */}
      {character.notes && (
        <div className="card card-glow relative">
          <div className="corner-decoration top-left" />
          <div className="corner-decoration top-right" />
          <h3 className="font-cyber text-lg mb-4 text-neon-magenta-400">Notes</h3>
          <p className="text-cyber-dark-300 whitespace-pre-wrap">{character.notes}</p>
        </div>
      )}
    </div>
  );
}
