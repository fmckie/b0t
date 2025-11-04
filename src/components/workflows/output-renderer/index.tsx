'use client';

import { detectOutputDisplay, type OutputDisplayConfig } from '@/lib/workflows/analyze-output-display';
import { DataTable } from './data-table';
import { ImageDisplay, ImageGrid } from './image-display';

interface OutputRendererProps {
  output: unknown;
  modulePath?: string;
  displayHint?: OutputDisplayConfig;
}

export function OutputRenderer({ output, modulePath, displayHint }: OutputRendererProps) {
  // Priority: 1) displayHint from workflow config, 2) module-based detection, 3) structure-based detection
  const display = displayHint || detectOutputDisplay(modulePath || '', output);

  switch (display.type) {
    case 'table':
      return <DataTable data={output} config={display.config} />;

    case 'image':
      return <ImageDisplay data={output} config={display.config} />;

    case 'images':
      return <ImageGrid data={output} config={display.config} />;

    case 'markdown':
      return <MarkdownDisplay content={output} />;

    case 'text':
      return <TextDisplay content={output} />;

    case 'list':
      return <ListDisplay data={output} />;

    case 'json':
    default:
      return <JSONDisplay data={output} />;
  }
}

function MarkdownDisplay({ content }: { content: unknown }) {
  // Simple markdown rendering - can be enhanced with a markdown library later
  const text = String(content);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border/50 bg-surface/50 p-4">
      <div className="whitespace-pre-wrap break-words">{text}</div>
    </div>
  );
}

function TextDisplay({ content }: { content: unknown }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
      <div className="text-sm whitespace-pre-wrap break-words">{String(content)}</div>
    </div>
  );
}

function ListDisplay({ data }: { data: unknown }) {
  if (!Array.isArray(data)) {
    return <div className="text-sm text-muted-foreground">Invalid list data</div>;
  }

  return (
    <div className="rounded-lg border border-border/50 bg-surface/50 p-4">
      <ul className="space-y-2 list-disc list-inside">
        {data.map((item, idx) => (
          <li key={idx} className="text-sm">
            {String(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function JSONDisplay({ data }: { data: unknown }) {
  const jsonString =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <div className="rounded-lg border border-border/50 bg-surface/50 p-3">
      <pre className="text-xs overflow-x-auto max-h-96">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}
