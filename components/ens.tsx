'use client';

import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

type ENSProfile = {
  id: string;
  name: string;
  owner: {
    id: string;
  };
  resolver: {
    address: string;
    texts: string[];
  };
  createdAt: string;
  expiryDate: string;
};

type ENSProfileProps = {
  domain?: ENSProfile;
  className?: string;
};

const SAMPLE: ENSProfile = {
  id: '0xfd6a6b0e99f83df16a5b0dfa9ce74d3a6026b2c2f06eea38e8506c18633fe359',
  name: 'wais.eth',
  owner: {
    id: '0x5985062af881373d5429a99e389f83697aa217e5',
  },
  resolver: {
    address: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
    texts: ['avatar'],
  },
  createdAt: '1647724305',
  expiryDate: '1781686209',
};

export function ENSProfile({ domain = SAMPLE, className }: ENSProfileProps) {
  const createdDate = new Date(parseInt(domain.createdAt) * 1000);
  const expiryDate = new Date(parseInt(domain.expiryDate) * 1000);

  return (
    <Card className="max-w-[500px] bg-card">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">ENS</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold text-card-foreground">
            {domain.name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">
            {`${domain.owner.id.slice(0, 6)}...${domain.owner.id.slice(-4)}`}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {format(createdDate, 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Expires</span>
            <span className="text-sm">{format(expiryDate, 'MMM d, yyyy')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Records</span>
            <span className="text-sm">
              {domain.resolver.texts.join(', ') || 'None'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
