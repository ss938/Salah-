"use client";
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Gamepad2, Globe } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const t = useTranslations('App');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const tabs =[
    { id: 'dashboard', label: t('dashboard') },
    { id: 'grid', label: t('habitsGrid') },
    { id: 'progress', label: t('progress') }
  ];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 bg-surface border-b border-slate-700 shadow-md">
      <div className="flex items-center gap-3 mb-4 md:mb-0 text-primary">
        <Gamepad2 size={32} />
        <h1 className="text-2xl font-bold text-white tracking-wide">{t('title')}</h1>
      </div>
      
      <nav className="flex gap-2 bg-background p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id ? 'bg-primary text-background shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button onClick={toggleLanguage} className="mt-4 md:mt-0 flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
        <Globe size={20} />
        <span className="font-medium">{locale === 'ar' ? 'English' : 'العربية'}</span>
      </button>
    </header>
  );
}
