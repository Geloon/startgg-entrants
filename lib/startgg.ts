import { GraphQLClient, gql } from 'graphql-request';

const ENDPOINT = 'https://api.start.gg/gql/alpha';

export interface Entrant {
  gamerTag: string;
  user?: {
    name?: string;
  };
  events?: {
    name: string;
  }[];
}

export interface TournamentData {
  name: string;
  participants: {
    nodes: Entrant[];
  };
}

const TOURNAMENT_QUERY = gql`
  query TournamentEntrants($slug: String!, $page: Int!, $perPage: Int!) {
    tournament(slug: $slug) {
      name
      participants(query: { page: $page, perPage: $perPage }) {
        pageInfo {
          totalPages
        }
        nodes {
          gamerTag
          user {
            name
          }
          events {
            name
          }
        }
      }
    }
  }
`;

export async function fetchTournamentEntrants(slug: string, token: string): Promise<{ name: string; entrants: Entrant[] }> {
  const client = new GraphQLClient(ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  let allEntrants: Entrant[] = [];
  let page = 1;
  let totalPages = 1;
  let tournamentName = '';

  // Fetch first page to get metadata
  do {
    const data: any = await client.request(TOURNAMENT_QUERY, {
      slug,
      page,
      perPage: 499, // limit is usually 500
    });

    if (!data.tournament) {
      throw new Error('Tournament not found or invalid slug');
    }

    tournamentName = data.tournament.name;
    const participants = data.tournament.participants;
    
    if (participants.nodes) {
        allEntrants = [...allEntrants, ...participants.nodes];
    }
    
    totalPages = participants.pageInfo.totalPages;
    page++;

  } while (page <= totalPages);

  return { name: tournamentName, entrants: allEntrants };
}

export function extractSlug(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('start.gg') && u.pathname.includes('/tournament/')) {
        const parts = u.pathname.split('/');
        const index = parts.indexOf('tournament');
        if (index !== -1 && parts[index + 1]) {
            return parts[index + 1];
        }
    }
    return null;
  } catch (e) {
    return null;
  }
}
