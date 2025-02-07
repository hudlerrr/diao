import { tool } from 'ai';
import { z } from 'zod';

const DomainResponseSchema = z.object({
  data: z.object({
    domains: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        owner: z.object({
          id: z.string(),
        }),
        resolver: z
          .object({
            address: z.string().nullable(),
            texts: z.array(z.string()).nullable(),
          })
          .nullable(),
        createdAt: z.string(),
        expiryDate: z.string().nullable(),
      })
    ),
  }),
});

type DomainResponse = z.infer<typeof DomainResponseSchema>;

export const getDomainOwner = tool({
  description:
    'Get the ENS domain owner information for a given ENS domain name',
  parameters: z.object({
    domain: z
      .string()
      .describe('ENS domain name to lookup (e.g., "vitalik.eth")'),
  }),
  execute: async ({ domain }) => {
    const query = `
      query GetDomainDetails {
        domains(where: {name: "${domain.toLowerCase()}"}) {
          id
          name
          owner {
            id
          }
          resolver {
            address
            texts
          }
          createdAt
          expiryDate
        }
      }
    `;

    try {
      const response = await fetch(
        'https://gateway.thegraph.com/api/' +
          process.env.GRAPH_API_KEY +
          '/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
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
        return { error: true, message: 'Failed to fetch ENS data' };
      }

      const result = await response.json();
      const validated = DomainResponseSchema.safeParse(result);

      if (!validated.success) {
        return { error: true, message: 'Invalid ENS data format' };
      }

      if (validated.data.data.domains.length === 0) {
        return { error: true, message: `No ENS domain found for ${domain}` };
      }

      return validated.data;
    } catch (error: unknown) {
      return {
        error: true,
        message: 'Failed to fetch ENS domain information',
      };
    }
  },
});
