'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

type Proposal = {
  id: string;
  proposer: {
    id: string;
  };
  title: string;
  status: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  createdTimestamp: string;
};

type NounsProposalsProps = {
  proposals?: Array<Proposal>;
  className?: string;
};

const SAMPLE_PROPOSALS: Array<Proposal> = [
  {
    id: '1',
    proposer: {
      id: '0x1234...5678',
    },
    title: 'Sample Proposal',
    status: 'ACTIVE',
    forVotes: '100',
    againstVotes: '50',
    abstainVotes: '10',
    createdTimestamp: (Date.now() / 1000).toString(),
  },
];

export function NounsProposals({
  proposals = SAMPLE_PROPOSALS,
}: NounsProposalsProps) {
  const handleProposalClick = (proposalId: string) => {
    const textarea = document.querySelector(
      'textarea[placeholder="Send a message..."]'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = `Tell me more about Nouns proposal #${proposalId}`;
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
      textarea.focus();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onProposalClick={handleProposalClick}
        />
      ))}
    </div>
  );
}

type ProposalCard = {
  proposal: Proposal;
  onProposalClick?: (proposalId: string) => void;
};

function ProposalCard({ proposal, onProposalClick }: ProposalCard) {
  const createdDate = new Date(Number(proposal.createdTimestamp) * 1000);
  const totalVotes =
    Number(proposal.forVotes) +
    Number(proposal.againstVotes) +
    Number(proposal.abstainVotes);
  const forPercentage = (Number(proposal.forVotes) / totalVotes) * 100;
  const againstPercentage = (Number(proposal.againstVotes) / totalVotes) * 100;
  const abstainPercentage = (Number(proposal.abstainVotes) / totalVotes) * 100;

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card
      className="bg-card h-[200px] flex flex-col relative group transition-all hover:shadow-md hover:scale-[1.02] duration-200 cursor-pointer"
      onClick={() => onProposalClick?.(proposal.id)}
    >
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="size-8 shrink-0 absolute right-2 top-2 z-10"
      >
        <a
          href={`https://nouns.wtf/vote/${proposal.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="size-4" />
        </a>
      </Button>
      <div className="flex flex-col flex-1">
        <CardHeader className="p-4 grow">
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground">{proposal.status}</p>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-base text-wrap text-card-foreground line-clamp-2">
              {truncateTitle(proposal.title, 70)}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Proposed {formatDistanceToNow(createdDate, { addSuffix: true })}
            </p>
            <p className="text-sm text-muted-foreground">
              By: {truncateAddress(proposal.proposer.id)}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Votes: {totalVotes}
            </p>
          </div>
          <div>
            <div className="relative h-1 rounded-full overflow-hidden bg-muted">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500"
                style={{ width: `${forPercentage}%` }}
              />
              <div
                className="absolute h-full bg-red-500"
                style={{
                  left: `${forPercentage}%`,
                  width: `${againstPercentage}%`,
                }}
              />
              <div
                className="absolute h-full bg-gray-400"
                style={{
                  left: `${forPercentage + againstPercentage}%`,
                  width: `${abstainPercentage}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
