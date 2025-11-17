import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AuthPage() {
  const { login, register: registerUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (values) => {
    setErrorMessage('');
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else {
        await registerUser({ name: values.name, email: values.email, password: values.password });
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || t('auth.error'));
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          {mode === 'login' ? t('Sign in to your account') : t('Create your account')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('Access personalized recommendations, order history, and saved preferences.')}
        </p>
      </header>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'register' && (
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">{t('Full name')}</span>
            <input
              type="text"
              {...register('name', { required: t('Name is required') })}
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </label>
        )}
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">{t('Email')}</span>
          <input
            type="email"
            autoComplete="email"
            {...register('email', { required: t('Email is required') })}
            className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">{t('Password')}</span>
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            {...register('password', {
              required: t('Password is required'),
              minLength: { value: 6, message: t('Use at least 6 characters') }
            })}
            className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
        </label>
        {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
        >
          {mode === 'login' ? t('Sign in') : t('Create account')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        {mode === 'login' ? t('New to the marketplace?') : t('Already have an account?')}{' '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          {mode === 'login' ? t('Create an account') : t('Sign in')}
        </button>
      </p>
    </div>
  );
}
