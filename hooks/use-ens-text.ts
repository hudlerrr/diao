'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

type EnsTextKey =
  | 'avatar'
  | 'description'
  | 'header'
  | 'com.twitter'
  | 'com.github'
  | 'com.discord';

type EnsTextRecords = {
  [K in EnsTextKey]?: string;
};

export function useEnsText(name: string | undefined) {
  const [records, setRecords] = useState<EnsTextRecords>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    async function fetchEnsText() {
      if (!name) {
        setRecords({});
        return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        const normalizedName = normalize(name);
        const keys: EnsTextKey[] = [
          'avatar',
          'description',
          'header',
          'com.twitter',
          'com.github',
          'com.discord',
        ];

        const results = await Promise.all(
          keys.map((key) =>
            publicClient
              .getEnsText({ name: normalizedName, key })
              .then((result) => ({ key, value: result }))
          )
        );

        const newRecords = results.reduce((acc, { key, value }) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        }, {} as EnsTextRecords);

        setRecords(newRecords);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch ENS text')
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnsText();
  }, [name]);

  return { records, isLoading, error };
}
