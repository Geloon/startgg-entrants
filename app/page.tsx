'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import TokenInput from '@/components/TokenInput';
import TournamentInput from '@/components/TournamentInput';
import EntrantList from '@/components/EntrantList';
import PDFGenerator from '@/components/PDFGenerator';
import StaffLogin from '@/components/StaffLogin';
import LanguageToggle from '@/components/LanguageToggle';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import { getEntrants, verifyStaffPassword } from '@/app/actions';
import { Entrant } from '@/lib/startgg';

function HomeContent() {
  const [token, setToken] = useState('');
  const [entrants, setEntrants] = useState<Entrant[]>([]);
  const [tournamentName, setTournamentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadCount, setDownloadCount] = useState(0);

  // Staff Mode State
  const [staffPassword, setStaffPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);

  const { t } = useLanguage();

  const handleStaffLogin = async (pwd: string) => {
    const isValid = await verifyStaffPassword(pwd);
    if (isValid) {
      setIsStaff(true);
      setStaffPassword(pwd);
      setToken(''); // Clear public token if any
      setError('');
    } else {
      setError(t.errorStaffPassword);
    }
  };

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.downloads) setDownloadCount(data.downloads);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = async (url: string) => {
    if (!token && !isStaff) {
      setError(t.errorToken);
      return;
    }
    setLoading(true);
    setError('');
    setEntrants([]);
    setTournamentName('');

    // Pass password if staff, otherwise pass token
    const res = await getEntrants(url, token, isStaff ? staffPassword : undefined);

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setTournamentName(res.data.name);
      setEntrants(res.data.entrants);
      if (res.data.entrants.length === 0) {
        setError(t.errorNoEntrants);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <LanguageToggle />
        </div>

        {/* Header with Branding */}
        <div className="flex flex-col items-center justify-center text-center mb-10 mt-8 animate-fade-in relative z-0">
          <div className="relative w-32 h-32 mb-4 bg-white rounded-full shadow-lg p-2 flex items-center justify-center overflow-hidden border-4 border-red-700 hover:scale-105 transition-transform duration-500">
            <img src="/logo.jpg" alt="Smash Bros Murcia" className="object-cover w-full h-full rounded-full" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500 mb-2 drop-shadow-sm tracking-tight">
            {t.title}
          </h1>
          <p className="text-lg font-medium text-red-800/80 dark:text-red-200/80">
            {t.subtitle}
          </p>

        </div>

        {/* Controls */}
        <div className="glass-panel rounded-2xl shadow-xl p-6 mb-8 ring-1 ring-white/20 animate-fade-in">

          <StaffLogin onLogin={handleStaffLogin} isLoggedIn={isStaff} />

          <div className="grid gap-6">
            {!isStaff && <TokenInput onTokenChange={setToken} />}

            <div className={`pt-4 ${!isStaff ? 'border-t border-gray-200/50 dark:border-gray-700/50' : ''}`}>
              <TournamentInput onSearch={handleSearch} loading={loading} />
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50/90 dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 text-sm animate-pulse flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span><strong>Error:</strong> {error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {entrants.length > 0 && (
          <div className="space-y-6 animate-fade-in animate-delay-1">
            <div className="flex flex-col sm:flex-row justify-between items-center glass-panel p-6 rounded-2xl shadow-lg">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{tournamentName}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{entrants.length} {t.totalEntrants}</p>
              </div>
              <div className="w-full sm:w-auto flex justify-center">
                <PDFGenerator tournamentName={tournamentName} entrants={entrants} />
              </div>
            </div>

            <EntrantList entrants={entrants} />
          </div>
        )}

        {/* Empty State / Intro */}
        {entrants.length === 0 && !loading && !error && (
          <div className="text-center text-gray-400 mt-12 animate-fade-in animate-delay-1">
            <p>{t.introText}</p>
          </div>
        )}

        {/* Footer Branding */}
        <div className="mt-16 text-center text-sm text-gray-400 space-y-6 animate-fade-in animate-delay-2">
          <p>{t.madeWithLove}</p>

          {/* Stats Badge */}
          <div className="animate-fade-in animate-delay-3 flex justify-center">
            <div className="inline-flex items-center bg-[#b22222] text-white py-3 rounded-full shadow-lg border-2 border-white/20 hover:scale-105 transition-transform duration-300" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
              {/* 1. Left Logo */}
              <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden shadow-sm mr-12">
                <Image src="/logo.jpg" alt="Logo" width={24} height={24} className="object-cover" />
              </div>

              {/* 2. Text Content (Number + Text) */}
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold tracking-wide" style={{ marginRight: '20px' }}>{downloadCount.toLocaleString()}</span>
                <span className="text-xs font-bold uppercase opacity-90 tracking-widest leading-none">
                  {t.downloadCountText.replace('{count}', '').replace('!', '').replace('¡', '').trim()}
                </span>
              </div>

              {/* 3. Right Logo */}
              <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden shadow-sm ml-12">
                <Image src="/logo.jpg" alt="Logo" width={24} height={24} className="object-cover" />
              </div>
            </div>
          </div>

          {/* Ko-fi Button */}
          <div className="animate-fade-in animate-delay-2 pb-8">
            <a
              href="https://ko-fi.com/geloon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#29abe0] hover:bg-[#1f8ebd] text-white rounded-full transition-all shadow-md hover:shadow-lg font-bold text-xs"
            >
              <span role="img" aria-label="coffee" className="text-base">☕</span> {t.supportKofi}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
