'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useRegisterMutation } from '@/store/services/auth-api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/auth-slice';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data).unwrap();
      dispatch(setCredentials(result));

      // Store tokens in localStorage
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);

      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-neon-magenta-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-neon-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="card card-glow w-full max-w-md relative z-10">
        {/* Corner decorations */}
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />

        <h1 className="text-2xl md:text-3xl font-cyber font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-neon-magenta-400 to-neon-violet-400 bg-clip-text text-transparent">
          {t('auth.register')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-neon-violet-400/80">
              {t('auth.username')}
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              autoComplete="username"
              className="input-field w-full h-12"
              placeholder="V"
            />
            {errors.username && (
              <p className="text-neon-magenta-400 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-neon-violet-400/80">
              {t('auth.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className="input-field w-full h-12"
              placeholder="edgerunner@nightcity.nc"
            />
            {errors.email && (
              <p className="text-neon-magenta-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-neon-violet-400/80">
              {t('auth.password')}
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              autoComplete="new-password"
              className="input-field w-full h-12"
            />
            {errors.password && (
              <p className="text-neon-magenta-400 text-sm mt-1">{t('auth.errors.weakPassword')}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-neon-magenta-500/10 border border-neon-magenta-500/30">
              <p className="text-neon-magenta-400 text-sm">{t('auth.errors.emailExists')}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full font-cyber tracking-wider uppercase min-h-[52px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('common.loading')}
              </span>
            ) : (
              t('auth.registerButton')
            )}
          </button>
        </form>

        <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-neon-violet-500/20 text-center">
          <p className="text-cyber-dark-400 text-sm md:text-base">
            {t('auth.hasAccount')}{' '}
            <Link
              href="/login"
              className="text-neon-cyan-400 active:text-neon-cyan-300 transition-colors font-medium"
            >
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
