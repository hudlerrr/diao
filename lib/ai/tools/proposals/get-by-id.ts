import { tool } from 'ai';
import { z } from 'zod';

const ProposalResponseSchema = z.object({
  data: z.object({
    proposal: z.object({
      id: z.string(),
      proposer: z.object({
        id: z.string(),
      }),
      title: z.string(),
      description: z.string(),
      status: z.string(),
      createdTimestamp: z.string(),
      createdBlock: z.string(),
      startBlock: z.string(),
      endBlock: z.string(),
      forVotes: z.string(),
      againstVotes: z.string(),
      abstainVotes: z.string(),
      quorumVotes: z.string(),
      proposalThreshold: z.string(),
    }),
  }),
});

type ProposalResponse = z.infer<typeof ProposalResponseSchema>;

export const getNounsProposalById = tool({
  description: 'Get a specific Nouns DAO governance proposal by ID',
  parameters: z.object({
    id: z.string().describe('The ID of the proposal to fetch'),
  }),
  execute: async ({ id }) => {
    const query = `
      query GetProposalById {
        proposal(id: "${id}") {
          id
          proposer {
            id
          }
          title
          description
          status
          createdTimestamp
          createdBlock
          startBlock
          endBlock
          forVotes
          againstVotes
          abstainVotes
          quorumVotes
          proposalThreshold
        }
      }
    `;

    try {
      if (!process.env.GRAPH_API_KEY) {
        return {
          data: {
            proposal: {
              id: 'sample',
              proposer: {
                id: '0x1234...5678',
              },
              title: 'API Key Required',
              description: 'Please provide a valid Graph API key',
              status: 'ACTIVE',
              createdTimestamp: (Date.now() / 1000).toString(),
              createdBlock: '0',
              startBlock: '0',
              endBlock: '0',
              forVotes: '0',
              againstVotes: '0',
              abstainVotes: '0',
              quorumVotes: '0',
              proposalThreshold: '0',
            },
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
        throw new Error('Failed to fetch proposal');
      }

      const result = await response.json();
      const validated = ProposalResponseSchema.safeParse(result);

      if (!validated.success) {
        throw new Error('Invalid data format');
      }

      return validated.data;
    } catch (error: unknown) {
      return {
        data: {
          proposal: {
            id: 'error',
            proposer: {
              id: '0x0000...0000',
            },
            title: 'Error fetching proposal',
            description:
              error instanceof Error ? error.message : 'Unknown error',
            status: 'ERROR',
            createdTimestamp: (Date.now() / 1000).toString(),
            createdBlock: '0',
            startBlock: '0',
            endBlock: '0',
            forVotes: '0',
            againstVotes: '0',
            abstainVotes: '0',
            quorumVotes: '0',
            proposalThreshold: '0',
          },
        },
      };
    }
  },
});
