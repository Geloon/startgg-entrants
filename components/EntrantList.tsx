'use client';

import { Entrant } from '@/lib/startgg';
import { useLanguage } from '@/components/LanguageContext';

interface Props {
    entrants: Entrant[];
}

export default function EntrantList({ entrants }: Props) {
    const { t } = useLanguage();
    if (entrants.length === 0) return null;

    return (
        <div className="w-full animate-fade-in animate-delay-2">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden border rounded-xl shadow-sm glass-panel">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                    <thead className="text-xs uppercase bg-red-50/50 dark:bg-red-900/30 text-red-900 dark:text-red-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold">{t.tableHeaderHashtag}</th>
                            <th scope="col" className="px-6 py-4 font-bold">{t.tableHeaderGamertag}</th>
                            <th scope="col" className="px-6 py-4 font-bold">{t.tableHeaderName}</th>
                            <th scope="col" className="px-6 py-4 font-bold">{t.tableHeaderEvents}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {entrants.map((entrant, index) => (
                            <tr key={index} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-400">{index + 1}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-base">{entrant.gamerTag}</td>
                                <td className="px-6 py-4">{entrant.user?.name || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {entrant.events?.map((e, i) => (
                                            <span key={i} className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-100 dark:border-blue-800">
                                                {e.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {entrants.map((entrant, index) => (
                    <div key={index} className="glass-panel p-4 rounded-xl shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-mono text-gray-400 mb-1 block">#{index + 1}</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{entrant.gamerTag}</h3>
                                {entrant.user?.name && <p className="text-sm text-gray-500 dark:text-gray-400">{entrant.user.name}</p>}
                            </div>
                        </div>
                        {entrant.events && entrant.events.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {entrant.events.map((e, i) => (
                                    <span key={i} className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-100 dark:border-blue-800">
                                        {e.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
