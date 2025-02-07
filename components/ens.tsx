'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  Copy,
  Twitter,
  Github,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEnsText } from '@/hooks/use-ens-text';
import { normalize } from 'viem/ens';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

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
  socials?: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  description?: string;
  banner?: string;
};

type ENSProfileProps = {
  domain?: ENSProfile;
  className?: string;
};

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const SAMPLE: ENSProfile = {
  id: '0xfd6a6b0e99f83df16a5b0dfa9ce74d3a6026b2c2f06eea38e8506c18633fe359',
  name: 'wais.eth',
  owner: {
    id: '0x5985062af881373d5429a99e389f83697aa217e5',
  },
  resolver: {
    address: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
    texts: [
      'avatar',
      'com.twitter',
      'com.github',
      'com.discord',
      'description',
      'header',
    ],
  },
  createdAt: '1647724305',
  expiryDate: '1781686209',
};

export function ENSProfile({ domain = SAMPLE, className }: ENSProfileProps) {
  const { records, isLoading } = useEnsText(domain.name);
  const createdDate = new Date(Number.parseInt(domain.createdAt) * 1000);
  const expiryDate = new Date(Number.parseInt(domain.expiryDate) * 1000);

  const socials = {
    twitter: records['com.twitter'],
    github: records['com.github'],
    discord: records['com.discord'],
  };

  return (
    <Card className="max-w-[500px] bg-card overflow-hidden">
      <ProfileBanner banner={records.header} />
      <CardHeader className="relative pt-16 pb-4 text-center">
        <ProfileAvatar
          name={domain.name}
          hasAvatar={domain.resolver.texts.includes('avatar')}
        />
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-semibold text-card-foreground">
            {domain.name}
          </h3>
          <AddressCopy address={domain.owner.id} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {records.description && (
          <p className="text-sm text-muted-foreground text-center">
            {records.description}
          </p>
        )}

        <DateDisplay label="Created" date={createdDate} />
        <DateDisplay label="Expires" date={expiryDate} />
        <SocialLinks socials={socials} />
      </CardContent>
    </Card>
  );
}

function ProfileBanner({ banner }: { banner?: string }) {
  return (
    <div
      className="h-32 bg-cover bg-center"
      style={{
        backgroundImage: banner
          ? `url(${banner})`
          : 'linear-gradient(to right, #4f46e5, #3b82f6)',
      }}
    />
  );
}

function ProfileAvatar({
  name,
  hasAvatar,
}: {
  name: string;
  hasAvatar: boolean;
}) {
  return (
    <Avatar className="absolute -top-12 left-1/2 transform -translate-x-1/2 size-24 border-4 border-background">
      <AvatarImage
        src={
          hasAvatar
            ? `https://metadata.ens.domains/mainnet/avatar/${name}`
            : undefined
        }
        alt={name}
      />
      <AvatarFallback className="bg-primary/10">
        <span className="text-3xl font-semibold text-primary">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}

function AddressCopy({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-muted-foreground font-mono">
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </Button>
    </div>
  );
}

function DateDisplay({ label, date }: { label: string; date: Date }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{format(date, 'MMM d, yyyy')}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

function SocialLinks({ socials }: { socials?: ENSProfile['socials'] }) {
  if (!socials) return null;

  return (
    <div className="flex justify-center gap-2 pt-2">
      {socials.twitter && (
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <a
            href={`https://twitter.com/${socials.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="size-4" />
          </a>
        </Button>
      )}
      {socials.github && (
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <a
            href={`https://github.com/${socials.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4" />
          </a>
        </Button>
      )}
      {socials.discord && (
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <a
            href={`https://discord.com/users/${socials.discord}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="size-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
