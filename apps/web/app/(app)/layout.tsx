'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/auth-slice';
import { InstallButton } from '@/components/pwa/install-button';

const navItems = [
  { href: '/dashboard', labelKey: 'nav.home', icon: '🏠', color: 'cyan' },
  { href: '/characters', labelKey: 'nav.characters', icon: '👤', color: 'magenta' },
  { href: '/campaigns', labelKey: 'nav.campaigns', icon: '📜', color: 'violet' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan-500/30 border-t-neon-cyan-500 rounded-full animate-spin" />
          <p className="text-neon-cyan-400/70 font-cyber tracking-wider">LOADING...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (redirect in progress)
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-cyber-dark-950/95 backdrop-blur-sm border-b border-neon-cyan-500/20">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-cyber font-bold bg-gradient-to-r from-neon-cyan-400 to-neon-violet-400 bg-clip-text text-transparent">
            Player Sheet
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyber-dark-900 border border-neon-cyan-500/30 text-neon-cyan-400 active:bg-neon-cyan-500/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Menu */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-72 md:w-20 lg:w-64
          h-full md:h-auto
          top-0 left-0
          sidebar transition-transform duration-300 ease-in-out
          flex flex-col
          pt-20 md:pt-0
        `}
      >
        {/* Sidebar glow effect */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-neon-cyan-500/50 via-neon-violet-500/30 to-neon-magenta-500/50" />

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const colorClasses = {
                cyan: isActive
                  ? 'bg-neon-cyan-500/20 text-neon-cyan-400 border-neon-cyan-500/50 shadow-neon-cyan'
                  : 'hover:bg-neon-cyan-500/10 hover:border-neon-cyan-500/30 active:bg-neon-cyan-500/20',
                magenta: isActive
                  ? 'bg-neon-magenta-500/20 text-neon-magenta-400 border-neon-magenta-500/50 shadow-neon-magenta'
                  : 'hover:bg-neon-magenta-500/10 hover:border-neon-magenta-500/30 active:bg-neon-magenta-500/20',
                violet: isActive
                  ? 'bg-neon-violet-500/20 text-neon-violet-400 border-neon-violet-500/50 shadow-neon-violet'
                  : 'hover:bg-neon-violet-500/10 hover:border-neon-violet-500/30 active:bg-neon-violet-500/20',
              };

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-item ${colorClasses[item.color as keyof typeof colorClasses]} ${
                      isActive ? '' : 'text-cyber-dark-400 hover:text-white'
                    } min-h-[48px]`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium md:hidden lg:inline">{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-neon-cyan-500/20">
          {user && (
            <div className="mb-3 p-3 rounded-lg bg-cyber-dark-900/50 border border-cyber-dark-700 md:hidden lg:block">
              <p className="text-sm text-neon-cyan-400 font-medium truncate">{user.username}</p>
              <p className="text-xs text-cyber-dark-500 truncate">{user.email}</p>
            </div>
          )}
          <div className="mb-3 md:hidden lg:block">
            <InstallButton />
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-cyber-dark-400 hover:text-neon-magenta-400 hover:bg-neon-magenta-500/10 hover:border-neon-magenta-500/30 active:bg-neon-magenta-500/20 min-h-[48px]"
          >
            <span>🚪</span>
            <span className="md:hidden lg:inline">{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
    </div>
  );
}
