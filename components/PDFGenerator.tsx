'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Entrant } from '@/lib/startgg';
import { useLanguage } from '@/components/LanguageContext';

interface Props {
    tournamentName: string;
    entrants: Entrant[];
}

export default function PDFGenerator({ tournamentName, entrants }: Props) {
    const { t } = useLanguage();

    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(tournamentName, 14, 22);

        // Subtitle
        doc.setFontSize(11);
        doc.text(`Entrants List - ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total: ${entrants.length}`, 14, 36);

        const tableColumn = [t.tableHeaderHashtag, t.tableHeaderGamertag, t.tableHeaderName, t.tableHeaderEvents];
        const tableRows: any[] = [];

        entrants.forEach((entrant, index) => {
            const entrantData = [
                index + 1,
                entrant.gamerTag,
                entrant.user?.name || '-',
                entrant.events?.map(e => e.name).join(', ') || '-'
            ];
            tableRows.push(entrantData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 44,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [178, 34, 34] }, // Red for Murcia
        });

        const fileName = `${tournamentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_entrants.pdf`;
        doc.save(fileName);
    };

    return (
        <button
            onClick={generatePDF}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-bold flex items-center gap-2 transition-transform active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.downloadPDF}
        </button>
    );
}
