'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { RunOutputModal } from './run-output-modal';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';

interface WorkflowRun {
  id: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  output: unknown;
  error: string | null;
  errorStep: string | null;
  triggerType: string;
}

interface WorkflowOutputsDialogProps {
  workflowId: string;
  workflowName: string;
  workflowConfig?: Record<string, unknown>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    case 'error':
      return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case 'running':
      return <Clock className="h-3.5 w-3.5 text-blue-500 animate-spin" />;
    default:
      return <Clock className="h-3.5 w-3.5 text-gray-500" />;
  }
};

const formatDuration = (ms: number | null) => {
  if (!ms) return '—';
  return ms > 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function WorkflowOutputsDialog({
  workflowId,
  workflowName,
  workflowConfig,
  open,
  onOpenChange,
}: WorkflowOutputsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setRuns([]);
      setHasMore(true);
      fetchRuns(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, workflowId]);

  const fetchRuns = async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const offset = reset ? 0 : runs.length;
      const response = await fetch(
        `/api/workflows/${workflowId}/runs?limit=10&offset=${offset}`
      );
      if (!response.ok) throw new Error('Failed to fetch runs');

      const data = await response.json();
      const fetchedRuns = data.runs || [];

      if (reset) {
        setRuns(fetchedRuns);
      } else {
        setRuns((prev) => [...prev, ...fetchedRuns]);
      }

      // If we got less than 10, there's no more
      setHasMore(fetchedRuns.length === 10);
    } catch (error) {
      console.error('Failed to fetch workflow runs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      fetchRuns(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const columns: ColumnDef<WorkflowRun>[] = [
    {
      accessorKey: 'status',
      header: () => <div className="w-10">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {getStatusIcon(row.original.status)}
        </div>
      ),
    },
    {
      accessorKey: 'triggerType',
      header: 'Trigger',
      cell: ({ row }) => (
        <div className="font-medium text-sm capitalize">{row.original.triggerType}</div>
      ),
    },
    {
      accessorKey: 'duration',
      header: () => <div className="text-right">Duration</div>,
      cell: ({ row }) => (
        <div className="text-right text-xs font-mono text-secondary tabular-nums">
          {formatDuration(row.original.duration)}
        </div>
      ),
    },
    {
      accessorKey: 'startedAt',
      header: () => <div className="text-right">Time</div>,
      cell: ({ row }) => (
        <div className="text-right text-xs text-secondary tabular-nums">
          {formatDate(row.original.startedAt)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedRun(row.original);
            setOutputModalOpen(true);
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-muted hover:bg-muted/80"
        >
          View
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: runs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Workflow Outputs</DialogTitle>
            <DialogDescription>
              Viewing outputs from <span className="font-medium">{workflowName}</span>
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : runs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No runs yet. Execute the workflow to see outputs.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="border border-border/50 rounded-lg overflow-hidden bg-surface/80 backdrop-blur-sm shadow-sm">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="border-b border-border/50">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-xs font-semibold text-foreground/80 tracking-wide"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/30 hover:bg-background/30 transition-all duration-200"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3.5">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="h-4 flex items-center justify-center py-4">
                {loadingMore && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RunOutputModal
        run={selectedRun}
        modulePath={getLastStepModule(workflowConfig)}
        workflowConfig={workflowConfig}
        open={outputModalOpen}
        onOpenChange={setOutputModalOpen}
      />
    </>
  );
}

/**
 * Helper to get the module path of the last step (most likely to produce final output)
 */
function getLastStepModule(config: Record<string, unknown> | undefined): string {
  if (!config?.steps || !Array.isArray(config.steps)) return '';
  const lastStep = config.steps[config.steps.length - 1];
  if (lastStep && typeof lastStep === 'object' && 'module' in lastStep) {
    return String(lastStep.module);
  }
  return '';
}
