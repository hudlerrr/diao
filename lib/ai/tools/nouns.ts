import { tool } from 'ai';
import { z } from 'zod';

const ProposalsResponseSchema = z.object({
  data: z.object({
    proposals: z.array(
      z.object({
        id: z.string(),
        proposer: z.object({
          id: z.string(),
        }),
        title: z.string(),
        status: z.string(),
        forVotes: z.string(),
        againstVotes: z.string(),
        abstainVotes: z.string(),
        createdTimestamp: z.string(),
      })
    ),
  }),
});

type ProposalsResponse = z.infer<typeof ProposalsResponseSchema>;

export const getNounsProposals = tool({
  description: 'Get the latest active Nouns DAO governance proposals',
  parameters: z.object({}),
  execute: async () => {
    const query = `
      query LatestActiveProposals {
        proposals(first: 9, orderBy: createdTimestamp, orderDirection: desc, where: { status: ACTIVE }) {
          id
          proposer {
            id
          }
          title
          status
          forVotes
          againstVotes
          abstainVotes
          createdTimestamp
        }
      }
    `;

    try {
      if (!process.env.GRAPH_API_KEY) {
        // Return sample data for demonstration when API key is missing
        return {
          data: {
            proposals: [
              {
                id: 'sample',
                proposer: {
                  id: '0x1234...5678',
                },
                title: 'API Key Required',
                status: 'ACTIVE',
                forVotes: '0',
                againstVotes: '0',
                abstainVotes: '0',
                createdTimestamp: (Date.now() / 1000).toString(),
              },
            ],
          },
        };
      }

      const response = await fetch(
        'https://gateway.thegraph.com/api/' +
          process.env.GRAPH_API_KEY +
          '/subgraphs/id/5qcR6rAfDMZCVGuZ6DDois7y4zyXqsyqvaqhE6NRRraW',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      if (!response.ok) {
        // Return sample data for demonstration when API request fails
        return {
          data: {
            proposals: [
              {
                id: 'error',
                proposer: {
                  id: '0x0000...0000',
                },
                title: 'Failed to fetch proposals',
                status: 'ACTIVE',
                forVotes: '0',
                againstVotes: '0',
                abstainVotes: '0',
                createdTimestamp: (Date.now() / 1000).toString(),
              },
            ],
          },
        };
      }

      const result = await response.json();
      const validated = ProposalsResponseSchema.safeParse(result);

      if (!validated.success) {
        // Return sample data for demonstration when validation fails
        return {
          data: {
            proposals: [
              {
                id: 'invalid',
                proposer: {
                  id: '0x0000...0000',
                },
                title: 'Invalid data format',
                status: 'ACTIVE',
                forVotes: '0',
                againstVotes: '0',
                abstainVotes: '0',
                createdTimestamp: (Date.now() / 1000).toString(),
              },
            ],
          },
        };
      }

      if (validated.data.data.proposals.length === 0) {
        // Return sample data for demonstration when no proposals found
        return {
          data: {
            proposals: [
              {
                id: 'empty',
                proposer: {
                  id: '0x0000...0000',
                },
                title: 'No active proposals found',
                status: 'ACTIVE',
                forVotes: '0',
                againstVotes: '0',
                abstainVotes: '0',
                createdTimestamp: (Date.now() / 1000).toString(),
              },
            ],
          },
        };
      }

      return validated.data;
    } catch (error: unknown) {
      // Return sample data for demonstration when an error occurs
      return {
        data: {
          proposals: [
            {
              id: 'error',
              proposer: {
                id: '0x0000...0000',
              },
              title: 'Error fetching proposals',
              status: 'ACTIVE',
              forVotes: '0',
              againstVotes: '0',
              abstainVotes: '0',
              createdTimestamp: (Date.now() / 1000).toString(),
            },
          ],
        },
      };
    }
  },
});
