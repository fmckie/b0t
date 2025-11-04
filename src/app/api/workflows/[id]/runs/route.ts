import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { useSQLite, sqliteDb, postgresDb } from '@/lib/db';
import { workflowRunsTableSQLite, workflowRunsTablePostgres } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/workflows/[id]/runs
 * Get execution history for a workflow
 * Supports both SQLite and PostgreSQL
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  // Get limit and offset from query params
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  try {
    let runs;

    if (useSQLite) {
      if (!sqliteDb) {
        throw new Error('SQLite database not initialized');
      }

      // Get runs for this workflow (SQLite)
      runs = await sqliteDb
        .select({
          id: workflowRunsTableSQLite.id,
          status: workflowRunsTableSQLite.status,
          startedAt: workflowRunsTableSQLite.startedAt,
          completedAt: workflowRunsTableSQLite.completedAt,
          duration: workflowRunsTableSQLite.duration,
          error: workflowRunsTableSQLite.error,
          errorStep: workflowRunsTableSQLite.errorStep,
          output: workflowRunsTableSQLite.output,
          triggerType: workflowRunsTableSQLite.triggerType,
        })
        .from(workflowRunsTableSQLite)
        .where(eq(workflowRunsTableSQLite.workflowId, id))
        .orderBy(desc(workflowRunsTableSQLite.startedAt))
        .limit(limit)
        .offset(offset);

      // Parse JSON fields for SQLite
      const parsedRuns = runs.map((run) => ({
        ...run,
        output: run.output ? JSON.parse(run.output as string) : null,
      }));

      return NextResponse.json({ runs: parsedRuns });
    } else {
      if (!postgresDb) {
        throw new Error('PostgreSQL database not initialized');
      }

      // Get runs for this workflow (PostgreSQL)
      runs = await postgresDb
        .select({
          id: workflowRunsTablePostgres.id,
          status: workflowRunsTablePostgres.status,
          startedAt: workflowRunsTablePostgres.startedAt,
          completedAt: workflowRunsTablePostgres.completedAt,
          duration: workflowRunsTablePostgres.duration,
          error: workflowRunsTablePostgres.error,
          errorStep: workflowRunsTablePostgres.errorStep,
          output: workflowRunsTablePostgres.output,
          triggerType: workflowRunsTablePostgres.triggerType,
        })
        .from(workflowRunsTablePostgres)
        .where(eq(workflowRunsTablePostgres.workflowId, id))
        .orderBy(desc(workflowRunsTablePostgres.startedAt))
        .limit(limit)
        .offset(offset);

      // Parse JSON fields for PostgreSQL (output is stored as text)
      const parsedRuns = runs.map((run) => ({
        ...run,
        output: run.output ? JSON.parse(run.output as string) : null,
      }));

      return NextResponse.json({ runs: parsedRuns });
    }
  } catch (error) {
    console.error('Failed to fetch workflow runs:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
