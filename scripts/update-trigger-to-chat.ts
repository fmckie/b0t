import { db } from '../src/lib/db';
import { workflowsTable } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function updateTrigger() {
  // Find the "Simple AI Chat" workflow
  const workflows = await db
    .select()
    .from(workflowsTable)
    .where(eq(workflowsTable.name, 'Simple AI Chat'))
    .limit(1);

  if (workflows.length === 0) {
    console.error('Workflow not found');
    process.exit(1);
  }

  const workflow = workflows[0];
  console.log(`Found workflow: ${workflow.id}`);

  // Update trigger to chat type
  await db
    .update(workflowsTable)
    .set({
      trigger: JSON.stringify({
        type: 'chat',
        config: {}
      })
    } as Record<string, unknown>)
    .where(eq(workflowsTable.id, workflow.id));

  console.log('✅ Updated trigger type to "chat"');
  console.log('🌐 View at: http://localhost:3000/dashboard/workflows');
  console.log('💬 Click the "Chat" button to interact with the workflow');
  process.exit(0);
}

updateTrigger().catch(console.error);
