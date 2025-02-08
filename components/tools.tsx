'use client';

import { Weather } from './weather';
import { DocumentPreview } from './document-preview';
import { DocumentToolResult, DocumentToolCall } from './document';
import { ENSProfile } from './ens';
import { NounsProposals } from './nouns-proposals';

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
};

export function getToolComponent(
  toolName: string,
  isLoading: boolean = false
): ToolComponent['Component'] | null {
  const tool = tools[toolName];
  if (!tool) return null;

  return isLoading ? tool.LoadingComponent : tool.Component;
}
