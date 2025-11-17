import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../utils/apiClient.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AccountPage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    apiClient
      .get('/users/profile', {
        headers: { Authorization: `Bearer ${token()}` }
      })
      .then((response) => setProfile(response.data.profile))
      .catch((error) => console.error('Failed to load profile', error));
  }, [token]);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t('Welcome back,')} {user?.name}
          </h1>
          <p className="text-sm text-slate-600">{t('Manage your personal information and view recent orders.')}</p>
        </div>
        <Link
          to="/account/orders"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
        >
          {t('View orders')}
        </Link>
      </header>
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6" aria-labelledby="account-details">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="account-details" className="text-lg font-semibold text-slate-900">
              {t('Account details')}
            </h2>
            <p className="text-sm text-slate-600">{t('Your personal and contact information.')}</p>
          </div>
        </div>
        <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">{t('Name')}</dt>
            <dd>{profile?.name ?? user?.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">{t('Email')}</dt>
            <dd>{profile?.email ?? user?.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">{t('Default shipping city')}</dt>
            <dd>{profile?.defaultShipping?.city ?? t('Add a shipping address during checkout')}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">{t('Member since')}</dt>
            <dd>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '–'}</dd>
          </div>
        </dl>
      </section>
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6" aria-labelledby="account-preferences">
        <h2 id="account-preferences" className="text-lg font-semibold text-slate-900">
          {t('Preferences')}
        </h2>
        <p className="text-sm text-slate-600">
          {t('Update your communication preferences and saved payment methods in future iterations of the platform.')}
        </p>
      </section>
    </div>
  );
}
