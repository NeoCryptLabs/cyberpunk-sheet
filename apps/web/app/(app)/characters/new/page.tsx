'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateCharacterMutation } from '@/store/services/character-api';
import { WEAPON_TEMPLATES, ARMOR_TEMPLATES, CYBERWARE_TEMPLATES } from '@/lib/cyberpunk-data';

const WEAPON_TYPE_LABELS: Record<string, string> = {
  MELEE: 'Corps à corps',
  RANGED: 'À distance',
  EXOTIC: 'Exotique',
};

const ARMOR_TYPE_LABELS: Record<string, string> = {
  BODY: 'Corps',
  HEAD: 'Tête',
  SHIELD: 'Bouclier',
};

const ROLES = [
  'SOLO',
  'NETRUNNER',
  'TECH',
  'MEDTECH',
  'MEDIA',
  'EXEC',
  'LAWMAN',
  'FIXER',
  'NOMAD',
  'ROCKERBOY',
] as const;

const ROLE_ABILITIES: Record<string, string> = {
  SOLO: 'Conscience du combat',
  NETRUNNER: 'Interface',
  TECH: 'Fabricant',
  MEDTECH: 'Médecine',
  MEDIA: 'Crédibilité',
  EXEC: 'Travail d\'équipe',
  LAWMAN: 'Renforts',
  FIXER: 'Opérateur',
  NOMAD: 'Moto',
  ROCKERBOY: 'Impact charismatique',
};

const STATS = [
  { key: 'intelligence', label: 'INT' },
  { key: 'reflexes', label: 'REF' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'technology', label: 'TECH' },
  { key: 'cool', label: 'COOL' },
  { key: 'willpower', label: 'WILL' },
  { key: 'luck', label: 'LUCK' },
  { key: 'move', label: 'MOVE' },
  { key: 'body', label: 'BODY' },
  { key: 'empathy', label: 'EMP' },
] as const;

const weaponSchema = z.object({
  name: z.string(),
  type: z.enum(['MELEE', 'RANGED', 'EXOTIC']),
  damage: z.string(),
  rof: z.number(),
  magazine: z.number().optional(),
  skill: z.string().optional(),
  handsRequired: z.number().optional(),
  concealable: z.boolean().optional(),
});

const armorSchema = z.object({
  name: z.string(),
  type: z.enum(['BODY', 'HEAD', 'SHIELD']),
  stoppingPower: z.number(),
  penalty: z.number().optional(),
});

const cyberwareSchema = z.object({
  name: z.string(),
  type: z.string(),
  installation: z.enum(['MALL', 'CLINIC', 'HOSPITAL']),
  description: z.string(),
  humanityLoss: z.number(),
  cost: z.number(),
});

const inventoryItemSchema = z.object({
  name: z.string(),
});

const characterSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
  realName: z.string().optional(),
  role: z.enum(ROLES),
  stats: z.object({
    intelligence: z.number().min(2).max(8),
    reflexes: z.number().min(2).max(8),
    dexterity: z.number().min(2).max(8),
    technology: z.number().min(2).max(8),
    cool: z.number().min(2).max(8),
    willpower: z.number().min(2).max(8),
    luck: z.number().min(2).max(8),
    move: z.number().min(2).max(8),
    body: z.number().min(2).max(8),
    empathy: z.number().min(2).max(8),
  }),
  roleAbility: z.object({
    name: z.string(),
    rank: z.number().min(1).max(10),
  }),
  weapons: z.array(weaponSchema).optional(),
  armor: z.array(armorSchema).optional(),
  cyberware: z.array(cyberwareSchema).optional(),
  inventory: z.array(inventoryItemSchema).optional(),
  eurodollars: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

export default function NewCharacterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [createCharacter, { isLoading }] = useCreateCharacterMutation();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      stats: {
        intelligence: 5,
        reflexes: 5,
        dexterity: 5,
        technology: 5,
        cool: 5,
        willpower: 5,
        luck: 5,
        move: 5,
        body: 5,
        empathy: 5,
      },
      roleAbility: {
        name: '',
        rank: 4,
      },
      weapons: [],
      armor: [],
      cyberware: [],
      inventory: [],
      eurodollars: 2550,
    },
  });

  const { fields: weaponFields, append: appendWeapon, remove: removeWeapon } = useFieldArray({
    control,
    name: 'weapons',
  });

  const { fields: armorFields, append: appendArmor, remove: removeArmor } = useFieldArray({
    control,
    name: 'armor',
  });

  const { fields: cyberwareFields, append: appendCyberware, remove: removeCyberware } = useFieldArray({
    control,
    name: 'cyberware',
  });

  const { fields: inventoryFields, append: appendInventory, remove: removeInventory } = useFieldArray({
    control,
    name: 'inventory',
  });

  const [newInventoryItem, setNewInventoryItem] = useState('');

  // Modal states
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [showArmorModal, setShowArmorModal] = useState(false);
  const [showCyberwareModal, setShowCyberwareModal] = useState(false);
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

  const selectedRole = watch('role');
  const cyberwareList = watch('cyberware') || [];

  // Calculate total humanity loss from cyberware
  const totalHumanityLoss = cyberwareList.reduce((sum, c) => sum + (c?.humanityLoss || 0), 0);

  // Update role ability name when role changes
  useEffect(() => {
    if (selectedRole && ROLE_ABILITIES[selectedRole]) {
      setValue('roleAbility.name', ROLE_ABILITIES[selectedRole], { shouldValidate: true });
    }
  }, [selectedRole, setValue]);

  const handleRoleChange = (role: string) => {
    setValue('role', role as typeof ROLES[number], { shouldValidate: true });
  };

  const onSubmit = async (data: CharacterFormData) => {
    try {
      const characterData: Record<string, unknown> = {
        handle: data.handle,
        role: data.role,
        stats: data.stats,
        roleAbility: data.roleAbility,
      };

      if (data.realName) characterData.realName = data.realName;
      if (data.eurodollars !== undefined) characterData.eurodollars = data.eurodollars;
      if (data.notes) characterData.notes = data.notes;
      if (data.weapons && data.weapons.length > 0) characterData.weapons = data.weapons;
      if (data.armor && data.armor.length > 0) characterData.armor = data.armor;
      if (data.cyberware && data.cyberware.length > 0) characterData.cyberware = data.cyberware;
      if (data.inventory && data.inventory.length > 0) characterData.inventory = data.inventory;

      const result = await createCharacter(characterData).unwrap();
      router.push(`/characters/${result._id}`);
    } catch (err) {
      console.error('Failed to create character:', err);
    }
  };

  const totalStats = Object.values(watch('stats') || {}).reduce((sum, val) => sum + (val || 0), 0);
  const maxStats = 62;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl md:text-3xl font-cyber font-bold mb-1 bg-gradient-to-r from-neon-cyan-400 to-neon-violet-400 bg-clip-text text-transparent">
        {t('character.create')}
      </h1>
      <p className="text-cyber-dark-400 mb-6 text-sm md:text-base">Cyberpunk Red Character Sheet</p>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-1 md:gap-2 mb-6 md:mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => setStep(s)}
              className={`w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center font-cyber transition-all text-sm md:text-base ${
                step === s
                  ? 'bg-neon-cyan-500 text-white shadow-neon-cyan'
                  : step > s
                  ? 'bg-neon-cyan-500/30 text-neon-cyan-400'
                  : 'bg-cyber-dark-800 text-cyber-dark-500'
              }`}
            >
              {s}
            </button>
            {s < 4 && (
              <div className={`w-6 md:w-12 h-1 mx-1 md:mx-2 rounded ${step > s ? 'bg-neon-cyan-500' : 'bg-cyber-dark-800'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="card card-glow space-y-5 md:space-y-6">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />

            <h2 className="text-lg md:text-xl font-cyber text-neon-cyan-400">Identité</h2>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                  Handle *
                </label>
                <input
                  {...register('handle')}
                  className="input-field w-full h-12"
                  placeholder="V, Johnny, etc."
                />
                {errors.handle && (
                  <p className="text-neon-magenta-400 text-sm mt-1">{errors.handle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                  Vrai nom
                </label>
                <input
                  {...register('realName')}
                  className="input-field w-full h-12"
                  placeholder="Nom réel (optionnel)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                Rôle *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-3 md:p-3 rounded-lg border transition-all text-xs md:text-sm font-medium min-h-[44px] active:scale-95 ${
                      selectedRole === role
                        ? 'bg-neon-cyan-500/20 border-neon-cyan-400 text-neon-cyan-400 shadow-neon-cyan'
                        : 'bg-cyber-dark-900 border-cyber-dark-700 text-cyber-dark-400 active:bg-cyber-dark-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-neon-magenta-400 text-sm mt-1">Sélectionnez un rôle</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary font-cyber w-full md:w-auto min-h-[48px]"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Stats */}
        {step === 2 && (
          <div className="card card-glow space-y-5 md:space-y-6">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />

            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-cyber text-neon-cyan-400">Statistiques</h2>
              <div className={`font-mono text-sm md:text-base px-3 py-1 rounded-lg ${totalStats > maxStats ? 'text-neon-magenta-400 bg-neon-magenta-500/10' : 'text-neon-cyan-400 bg-neon-cyan-500/10'}`}>
                {totalStats} / {maxStats}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {STATS.map(({ key, label }) => (
                <div key={key} className="stat-box p-3">
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2 text-neon-violet-400">
                    {label}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={2}
                    max={8}
                    {...register(`stats.${key}` as const, { valueAsNumber: true })}
                    className="input-field w-full text-center text-xl md:text-2xl font-cyber h-12"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 md:p-4 bg-cyber-dark-900/50 rounded-lg border border-cyber-dark-700">
              <p className="text-xs md:text-sm text-cyber-dark-400">
                Les stats vont de 2 à 8. La somme standard pour un personnage débutant est de 62 points.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Equipment */}
        {step === 3 && (
          <div className="card card-glow space-y-5 md:space-y-6">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />

            <h2 className="text-lg md:text-xl font-cyber text-neon-cyan-400">Équipement</h2>

            {/* Weapons Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-neon-violet-400">Armes ({weaponFields.length})</h3>
              </div>

              {weaponFields.length > 0 && (
                <div className="space-y-2">
                  {weaponFields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-cyber-dark-900/50 rounded-lg border border-cyber-dark-700">
                      <div>
                        <span className="text-neon-cyan-400 font-medium">{field.name}</span>
                        <span className="text-cyber-dark-400 text-sm ml-2">
                          {field.damage} | ROF {field.rof}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWeapon(index)}
                        className="text-neon-magenta-400 hover:text-neon-magenta-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowWeaponModal(true)}
                className="input-field w-full h-12 text-left text-cyber-dark-400 hover:text-white hover:border-neon-magenta-500/50 transition-colors"
              >
                + Ajouter une arme...
              </button>
            </div>

            {/* Armor Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-neon-violet-400">Armures ({armorFields.length})</h3>
              </div>

              {armorFields.length > 0 && (
                <div className="space-y-2">
                  {armorFields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-cyber-dark-900/50 rounded-lg border border-cyber-dark-700">
                      <div>
                        <span className="text-neon-cyan-400 font-medium">{field.name}</span>
                        <span className="text-cyber-dark-400 text-sm ml-2">
                          SP {field.stoppingPower} | {field.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArmor(index)}
                        className="text-neon-magenta-400 hover:text-neon-magenta-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowArmorModal(true)}
                className="input-field w-full h-12 text-left text-cyber-dark-400 hover:text-white hover:border-neon-cyan-500/50 transition-colors"
              >
                + Ajouter une armure...
              </button>
            </div>

            {/* Cyberware Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-neon-violet-400">Cyberware ({cyberwareFields.length})</h3>
                <span className={`text-sm px-2 py-1 rounded ${totalHumanityLoss > 40 ? 'text-neon-magenta-400 bg-neon-magenta-500/10' : 'text-neon-cyan-400 bg-neon-cyan-500/10'}`}>
                  -{totalHumanityLoss} Humanité
                </span>
              </div>

              {cyberwareFields.length > 0 && (
                <div className="space-y-2">
                  {cyberwareFields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-cyber-dark-900/50 rounded-lg border border-cyber-dark-700">
                      <div>
                        <span className="text-neon-cyan-400 font-medium">{field.name}</span>
                        <span className="text-cyber-dark-400 text-sm ml-2">
                          -{field.humanityLoss} HL | {field.cost}eb
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCyberware(index)}
                        className="text-neon-magenta-400 hover:text-neon-magenta-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowCyberwareModal(true)}
                className="input-field w-full h-12 text-left text-cyber-dark-400 hover:text-white hover:border-neon-violet-500/50 transition-colors"
              >
                + Ajouter du cyberware...
              </button>
            </div>

            {/* Inventory Section (Free-form) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-neon-violet-400">Inventaire ({inventoryFields.length})</h3>
              </div>

              {inventoryFields.length > 0 && (
                <div className="space-y-2">
                  {inventoryFields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-cyber-dark-900/50 rounded-lg border border-cyber-dark-700">
                      <span className="text-neon-cyan-400">{field.name}</span>
                      <button
                        type="button"
                        onClick={() => removeInventory(index)}
                        className="text-neon-magenta-400 hover:text-neon-magenta-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInventoryItem}
                  onChange={(e) => setNewInventoryItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newInventoryItem.trim()) {
                      e.preventDefault();
                      appendInventory({ name: newInventoryItem.trim() });
                      setNewInventoryItem('');
                    }
                  }}
                  className="input-field flex-1 h-12"
                  placeholder="Ajouter un objet (Entrée pour valider)..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newInventoryItem.trim()) {
                      appendInventory({ name: newInventoryItem.trim() });
                      setNewInventoryItem('');
                    }
                  }}
                  className="btn-secondary px-4 h-12"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-primary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Role Ability & Finalize */}
        {step === 4 && (
          <div className="card card-glow space-y-5 md:space-y-6">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />

            <h2 className="text-lg md:text-xl font-cyber text-neon-cyan-400">Capacité de rôle & Finalisation</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                  Capacité de rôle
                </label>
                <div className="input-field w-full bg-cyber-dark-900/50 text-neon-cyan-400 font-medium h-12 flex items-center">
                  {selectedRole ? ROLE_ABILITIES[selectedRole] : 'Sélectionnez un rôle'}
                </div>
                <input type="hidden" {...register('roleAbility.name')} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                  Rang (1-10)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  {...register('roleAbility.rank', { valueAsNumber: true })}
                  className="input-field w-full h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                Eurodollars de départ
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                {...register('eurodollars', { valueAsNumber: true })}
                className="input-field w-full h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neon-cyan-400/80">
                Notes
              </label>
              <textarea
                {...register('notes')}
                className="input-field w-full h-28 md:h-24 resize-none"
                placeholder="Background, histoire, etc."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary font-cyber flex-1 md:flex-none min-h-[48px]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Création...
                  </span>
                ) : (
                  'Créer'
                )}
              </button>
            </div>
          </div>
        )}
      </form>

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

            {/* Results count */}
            <div className="text-xs text-cyber-dark-500 mb-2 flex-shrink-0">
              {filteredWeapons.length} résultat(s)
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredWeapons.length > 0 ? (
                  filteredWeapons.map((weapon) => (
                    <button
                      key={weapon.name}
                      type="button"
                      onClick={() => {
                        appendWeapon(weapon as z.infer<typeof weaponSchema>);
                        setShowWeaponModal(false);
                        setWeaponSearch('');
                      }}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-magenta-500/50 active:bg-cyber-dark-700 transition-all"
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
                type="button"
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

            {/* Results count */}
            <div className="text-xs text-cyber-dark-500 mb-2 flex-shrink-0">
              {filteredArmor.length} résultat(s)
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredArmor.length > 0 ? (
                  filteredArmor.map((armor) => (
                    <button
                      key={armor.name}
                      type="button"
                      onClick={() => {
                        appendArmor(armor as z.infer<typeof armorSchema>);
                        setShowArmorModal(false);
                        setArmorSearch('');
                      }}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-cyan-500/50 active:bg-cyber-dark-700 transition-all"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{armor.name}</span>
                        <span className="text-neon-cyan-400 text-sm">SP {armor.stoppingPower}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-cyber-dark-400">
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 rounded">{ARMOR_TYPE_LABELS[armor.type] || armor.type}</span>
                        {armor.penalty !== 0 && <span className="text-neon-magenta-400">Pénalité: {armor.penalty}</span>}
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
                type="button"
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
                placeholder="Rechercher du cyberware..."
                className="input-field w-full h-11"
                autoFocus
              />
            </div>

            {/* Results count */}
            <div className="text-xs text-cyber-dark-500 mb-2 flex-shrink-0">
              {filteredCyberware.length} résultat(s)
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 min-h-0">
              <div className="space-y-2 pb-4">
                {filteredCyberware.length > 0 ? (
                  filteredCyberware.map((cyber) => (
                    <button
                      key={cyber.name}
                      type="button"
                      onClick={() => {
                        appendCyberware(cyber as z.infer<typeof cyberwareSchema>);
                        setShowCyberwareModal(false);
                        setCyberwareSearch('');
                      }}
                      className="w-full p-3 text-left bg-cyber-dark-800 rounded-lg border border-cyber-dark-700 hover:border-neon-violet-500/50 active:bg-cyber-dark-700 transition-all"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{cyber.name}</span>
                        <span className="text-neon-violet-400 text-sm">-{cyber.humanityLoss} HL</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-cyber-dark-400">
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 rounded">{cyber.type}</span>
                        <span>{cyber.cost}eb</span>
                        <span className="px-1.5 py-0.5 bg-cyber-dark-700 rounded">{cyber.installation}</span>
                      </div>
                      {cyber.description && (
                        <p className="text-xs text-cyber-dark-500 mt-1 line-clamp-2">{cyber.description}</p>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-cyber-dark-500 py-8">Aucun résultat</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 pt-3 border-t border-cyber-dark-700 -mx-4 px-4 pb-safe">
              <button
                type="button"
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
