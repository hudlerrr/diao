'use client';

import { Weather } from './weather';
import { DocumentPreview } from './document-preview';
import { DocumentToolResult, DocumentToolCall } from './document';
import { ENSProfile } from './ens';
import { NounsProposals } from './nouns-proposals';
import { ProposalDetails } from './proposal-details';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

type ToolProps = {
  result?: any;
  args?: any;
  isReadonly: boolean;
};

type ToolComponent = {
  Component: (props: ToolProps) => JSX.Element;
  LoadingComponent: (props: Omit<ToolProps, 'result'>) => JSX.Element;
  usesSkeleton?: boolean;
};

export const tools: Record<string, ToolComponent> = {
  getWeather: {
    Component: ({ result }) => <Weather weatherAtLocation={result} />,
    LoadingComponent: () => <Weather />,
    usesSkeleton: true,
  },
  getDomainOwner: {
    Component: ({ result }) => <ENSProfile domain={result.data.domains[0]} />,
    LoadingComponent: () => <ENSProfile />,
    usesSkeleton: true,
  },
  getNounsProposals: {
    Component: ({ result }) => {
      if (!result || !result.data || !result.data.proposals) {
        return <NounsProposals />;
      }
      return <NounsProposals proposals={result.data.proposals} />;
    },
    LoadingComponent: () => <NounsProposals />,
    usesSkeleton: true,
  },
  createDocument: {
    Component: ({ result, isReadonly }) => (
      <DocumentPreview isReadonly={isReadonly} result={result} />
    ),
    LoadingComponent: ({ args, isReadonly }) => (
      <DocumentPreview isReadonly={isReadonly} args={args} />
    ),
  },
  updateDocument: {
    Component: ({ result, isReadonly }) => (
      <DocumentToolResult
        type="update"
        result={result}
        isReadonly={isReadonly}
      />
    ),
    LoadingComponent: ({ args, isReadonly }) => (
      <DocumentToolCall type="update" args={args} isReadonly={isReadonly} />
    ),
  },
  requestSuggestions: {
    Component: ({ result, isReadonly }) => (
      <DocumentToolResult
        type="request-suggestions"
        result={result}
        isReadonly={isReadonly}
      />
    ),
    LoadingComponent: ({ args, isReadonly }) => (
      <DocumentToolCall
        type="request-suggestions"
        args={args}
        isReadonly={isReadonly}
      />
    ),
  },
  getNounsProposalById: {
    Component: GetNounsProposalById,
    LoadingComponent: GetNounsProposalByIdLoading,
    usesSkeleton: false,
  },
};

export function getToolComponent(
  toolName: string,
  isLoading: boolean = false
): ToolComponent['Component'] | null {
  const tool = tools[toolName];
  if (!tool) return null;

  return isLoading ? tool.LoadingComponent : tool.Component;
}

export function GetNounsProposalById({ result, isReadonly }: ToolProps) {
  if (!result?.data?.proposal) {
    return <div>No proposal found</div>;
  }

  return <ProposalDetails proposal={result.data.proposal} />;
}

export function GetNounsProposalByIdLoading() {
  return (
    <Card className="w-full max-w-4xl mx-auto animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-3/4 bg-muted rounded" />
        <div className="h-4 w-48 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="h-2 bg-muted rounded-full" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
