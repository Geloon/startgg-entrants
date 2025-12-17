'use server';

import { fetchTournamentEntrants, extractSlug } from '@/lib/startgg';

export async function getEntrants(url: string, token: string, password?: string) {
    const slug = extractSlug(url);
    if (!slug) {
        return { error: 'Invalid Tournament URL. Please look for start.gg/tournament/...' };
    }

    // Determine which token to use
    let finalToken = token;

    // Check Staff Mode
    if (password) {
        if (password === process.env.STAFF_PASSWORD) {
            finalToken = process.env.STAFF_API_KEY || '';
        } else {
            return { error: 'Invalid Staff Password.' };
        }
    }

    if (!finalToken) {
        return { error: 'Missing API Token. Please provide your token or login as Staff.' };
    }

    try {
        const data = await fetchTournamentEntrants(slug, finalToken);
        return { data };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'Failed to fetch entrants.' };
    }
}

export async function verifyStaffPassword(password: string) {
    return password === process.env.STAFF_PASSWORD;
}
