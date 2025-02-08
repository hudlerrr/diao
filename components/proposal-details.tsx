'use client';

import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Maximize2, FileText } from 'lucide-react';
import { useBlock } from '@/hooks/use-block';

type ProposalDetailsProps = {
  proposal: {
    id: string;
    proposer: {
      id: string;
    };
    title: string;
    description: string;
    status: string;
    createdTimestamp: string;
    createdBlock: string;
    startBlock: string;
    endBlock: string;
    forVotes: string;
    againstVotes: string;
    abstainVotes: string;
    quorumVotes: string;
    proposalThreshold: string;
  };
};

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
  const { setBlock } = useBlock();
  const createdDate = new Date(Number(proposal.createdTimestamp) * 1000);

  const totalVotes =
    Number(proposal.forVotes) +
    Number(proposal.againstVotes) +
    Number(proposal.abstainVotes);

  const forPercentage = (Number(proposal.forVotes) / totalVotes) * 100;
  const againstPercentage = (Number(proposal.againstVotes) / totalVotes) * 100;
  const abstainPercentage = (Number(proposal.abstainVotes) / totalVotes) * 100;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDescriptionClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const boundingBox = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setBlock({
      documentId: `proposal-${proposal.id}-description`,
      kind: 'text',
      content: proposal.description,
      title: `Proposal #${proposal.id} Description`,
      isVisible: true,
      status: 'idle',
      boundingBox,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-muted">
              {proposal.status}
            </span>
            <span className="text-sm text-muted-foreground">
              Created {format(createdDate, 'PPP')}
            </span>
          </div>
          <h2 className="text-2xl font-bold">{proposal.title}</h2>
          <p className="text-sm text-muted-foreground">
            By: {truncateAddress(proposal.proposer.id)}
          </p>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <a
            href={`https://nouns.wtf/vote/${proposal.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Votes</span>
            <span>{totalVotes} total votes</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-muted">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${forPercentage}%`, float: 'left' }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${againstPercentage}%`, float: 'left' }}
            />
            <div
              className="h-full bg-gray-400"
              style={{ width: `${abstainPercentage}%`, float: 'left' }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-medium text-emerald-500">For</div>
              <div>{Number(proposal.forVotes).toLocaleString()} votes</div>
            </div>
            <div>
              <div className="font-medium text-red-500">Against</div>
              <div>{Number(proposal.againstVotes).toLocaleString()} votes</div>
            </div>
            <div>
              <div className="font-medium text-gray-500">Abstain</div>
              <div>{Number(proposal.abstainVotes).toLocaleString()} votes</div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={handleDescriptionClick}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>View Description</span>
          </div>
          <Maximize2 className="h-4 w-4" />
        </Button>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Created Block</div>
            <div>{proposal.createdBlock}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Start Block</div>
            <div>{proposal.startBlock}</div>
          </div>
          <div>
            <div className="text-muted-foreground">End Block</div>
            <div>{proposal.endBlock}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Quorum</div>
            <div>{Number(proposal.quorumVotes).toLocaleString()} votes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
