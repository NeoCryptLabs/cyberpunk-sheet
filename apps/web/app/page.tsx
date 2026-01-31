import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-neon-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-neon-magenta-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center max-w-2xl relative z-10">
        {/* Logo/Title with glow effect */}
        <div className="mb-6 relative">
          <h1 className="text-6xl md:text-7xl font-cyber font-black tracking-wider">
            <span className="bg-gradient-to-r from-neon-cyan-400 via-neon-violet-400 to-neon-magenta-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
              {t('app.name')}
            </span>
          </h1>
          {/* Decorative line */}
          <div className="mt-4 mx-auto w-48 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan-500 to-transparent" />
        </div>

        <p className="text-lg md:text-xl text-cyber-dark-300 mb-10 font-light tracking-wide">
          {t('app.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="btn-primary text-lg px-10 py-4 font-cyber tracking-wider uppercase"
          >
            {t('auth.login')}
          </Link>
          <Link
            href="/register"
            className="btn-secondary text-lg px-10 py-4 font-cyber tracking-wider uppercase"
          >
            {t('auth.register')}
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10">
        <FeatureCard
          title={t('character.title')}
          description="Créez et gérez vos fiches de personnage Cyberpunk Red avec toutes les stats, compétences et cyberware."
          icon="user"
          color="cyan"
        />
        <FeatureCard
          title={t('campaign.title')}
          description="Organisez vos campagnes, invitez des joueurs et suivez la progression de votre groupe."
          icon="globe"
          color="violet"
        />
        <FeatureCard
          title={t('journal.title')}
          description="Notez vos sessions, PNJ rencontrés, quêtes et lieux découverts dans un journal partagé."
          icon="book"
          color="magenta"
        />
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyber-dark-600 text-sm">
        <span className="w-8 h-[1px] bg-neon-cyan-500/30" />
        <span className="font-mono tracking-widest">NIGHT CITY 2045</span>
        <span className="w-8 h-[1px] bg-neon-cyan-500/30" />
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  color,
}: {
  title: string;
  description: string;
  icon: 'user' | 'globe' | 'book';
  color: 'cyan' | 'violet' | 'magenta';
}) {
  const colorClasses = {
    cyan: 'from-neon-cyan-400 to-neon-cyan-600 border-neon-cyan-500/30 hover:border-neon-cyan-400/60 hover:shadow-neon-cyan',
    violet: 'from-neon-violet-400 to-neon-violet-600 border-neon-violet-500/30 hover:border-neon-violet-400/60 hover:shadow-neon-violet',
    magenta: 'from-neon-magenta-400 to-neon-magenta-600 border-neon-magenta-500/30 hover:border-neon-magenta-400/60 hover:shadow-neon-magenta',
  };

  const iconSvg = {
    user: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    globe: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    book: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  return (
    <div className={`card card-glow group ${colorClasses[color]} transition-all duration-500`}>
      {/* Corner decorations */}
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />
      <div className="corner-decoration bottom-left" />
      <div className="corner-decoration bottom-right" />

      {/* Icon */}
      <div className={`mb-4 w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} p-[1px]`}>
        <div className="w-full h-full rounded-xl bg-cyber-dark-950 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
          {iconSvg[icon]}
        </div>
      </div>

      <h3 className={`text-xl font-cyber font-semibold mb-3 bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} bg-clip-text text-transparent`}>
        {title}
      </h3>
      <p className="text-cyber-dark-400 text-sm leading-relaxed group-hover:text-cyber-dark-300 transition-colors">
        {description}
      </p>
    </div>
  );
}
