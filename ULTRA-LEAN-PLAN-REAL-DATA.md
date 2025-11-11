# Ultra-Lean Optimization Plan (Based on Real Data)

## Key Findings from Real Workflows

**From analyzing 15 actual workflows:**
- 80% are simple (1-7 steps)
- 80% of module usage: Utilities (60%) + AI (20%)
- 60% use manual or cron triggers
- 60% need OpenAI credentials
- 73% use JavaScript execute module
- 47% output to tables

**Current Skills:**
- workflow-builder: 476 lines
- workflow-fixer: 415 lines
- examples.md exists: 512 lines (6 full examples)

---

## Ultra-Lean Target

### workflow-builder: 476 → **180 lines** (62% reduction)

**What to KEEP (based on 80/20 rule):**

1. **Process (40 lines)**
   - Parse request
   - Search modules command
   - Parameter detection (condensed)
   - Validation pipeline (commands only)

2. **Critical Rules (30 lines)**
   - Top 5 mistakes (returnValue, AI SDK, zipToObjects, chat-input, variables)

3. **Common Triggers (40 lines)**
   - manual, cron, chat-input (covers 73% of use cases)
   - Rules only, examples → reference

4. **Top 5 Modules (40 lines)**
   - javascript.execute
   - ai-sdk.generateText
   - array-utils (top 5 functions)
   - json-transform.parseJson
   - Brief signatures only

5. **Basic Structure (30 lines)**
   - Minimal JSON template
   - Link to examples.md

**Total: ~180 lines**

**What to MOVE:**

- All 7 trigger examples (63 lines) → `reference/triggers.md`
- All step input formats (41 lines) → examples.md
- Variable reference examples (32 lines) → examples.md
- All credential examples (39 lines) → `reference/credentials.md`
- All output display examples (48 lines) → examples.md
- AI SDK examples (37 lines) → examples.md
- Module categories (26 lines) → `reference/modules.md`

**Moved: ~286 lines**

---

### workflow-fixer: 415 → **200 lines** (52% reduction)

**What to KEEP:**

1. **Validation Pipeline (20 lines)**
   - 6 commands (condensed)

2. **Error Catalog (120 lines)**
   - Module errors (keep)
   - AI SDK errors (keep)
   - Variable errors (keep)
   - Array/data errors (keep)
   - Credential errors (keep)
   - Validation errors (keep)
   - Execution errors (condense to 10 lines)

3. **Testing Commands (20 lines)**
   - Dry-run vs full test
   - Brief interpretation

4. **Debugging Checklist (25 lines)**
   - Step-by-step process

5. **Quick Solutions (15 lines)**
   - Most common fixes

**Total: ~200 lines**

**What to MOVE:**

- Update workflow procedures (32 lines) → `reference/management.md`
- Rate limiting (29 lines) → `reference/advanced.md`
- Parallelization (21 lines) → `reference/advanced.md`
- Control flow debugging (51 lines) → `reference/advanced.md`
- Database operations (12 lines) → `reference/advanced.md`
- OAuth details (11 lines) → `reference/advanced.md`

**Moved: ~156 lines**

---

## New Reference Structure

### Use existing examples.md pattern:

```
.claude/skills/workflow-generator/
├── SKILL.md              (738 lines - OLD, keep as backup)
├── examples.md           (512 lines - EXISTING)
└── reference/            (NEW)
    ├── triggers.md       (~100 lines - all trigger configs)
    ├── credentials.md    (~80 lines - credential patterns)
    ├── modules.md        (~60 lines - module categories + search)
    ├── management.md     (~50 lines - update/version workflows)
    └── advanced.md       (~120 lines - rate limit, parallel, control flow, DB, OAuth)

.claude/skills/workflow-builder/
└── SKILL.md              (180 lines - ULTRA LEAN)

.claude/skills/workflow-fixer/
└── SKILL.md              (200 lines - ULTRA LEAN)
```

**Total reference: ~410 lines** (loaded on-demand)

---

## How It Works

### Building a Simple Workflow (80% of cases):

```
User: "Create a workflow to summarize text daily"
→ workflow-builder loads (180 lines)
→ Has everything needed:
   - cron trigger (in skill)
   - ai-sdk.generateText (in skill)
   - table output (in skill)
→ No reference docs needed
→ Context: 180 lines
```

### Building Complex Workflow (20% of cases):

```
User: "Create workflow with Gmail trigger and database"
→ workflow-builder loads (180 lines)
→ Sees: "Gmail trigger - see reference/triggers.md"
→ LLM reads reference/triggers.md (100 lines)
→ Sees: "Database - see reference/advanced.md"
→ LLM reads reference/advanced.md (120 lines)
→ Context: 180 + 100 + 120 = 400 lines (still 16% less than current 476!)
```

### Debugging Workflow:

```
User: "Workflow has validation error"
→ workflow-fixer loads (200 lines)
→ Finds error in catalog
→ Context: 200 lines (52% less than current 415!)
```

---

## Implementation Plan

### Phase 1: Create Reference Docs

1. **reference/triggers.md** (from workflow-builder lines 156-218)
   - All 9 trigger types with full configs
   - When to use each
   - Access patterns

2. **reference/credentials.md** (from workflow-builder lines 296-345)
   - 3 credential syntaxes
   - Common names table
   - OAuth vs API key patterns
   - Check existing workflows command

3. **reference/modules.md** (from workflow-builder lines 434-459)
   - 16 module categories
   - Folder mapping
   - Search strategies
   - Top 20 most-used modules with signatures

4. **reference/management.md** (from workflow-fixer lines 203-234)
   - Update existing workflows
   - Create new versions
   - Commands and process

5. **reference/advanced.md** (from workflow-fixer lines 236-364)
   - Rate limiting strategies
   - Parallelization debugging
   - Control flow patterns
   - Database operations
   - OAuth token management

### Phase 2: Create Ultra-Lean Skills

**workflow-builder (180 lines):**

```markdown
# Workflow Builder

**For debugging**: Use /fix-workflow

## Process

### 1. Parse Request
What data → Transform → When

### 2. Search Modules
```bash
npx tsx scripts/search-modules.ts "keyword"
```

### 3. Detect Parameters
- AI SDK → options wrapper
- (params: ...) → params wrapper
- (options: ...) → options wrapper
- (arg1, arg2) → direct

### 4. Build JSON
See examples.md for templates.
Basic structure:
```json
{
  "version": "1.0",
  "name": "Name",
  "trigger": { "type": "manual|cron|chat-input", "config": {} },
  "config": {
    "steps": [{"id": "step1", "module": "category.module.func", "inputs": {}, "outputAs": "var"}],
    "returnValue": "{{var}}",
    "outputDisplay": {"type": "table|text", "columns": []}
  },
  "metadata": {"requiresCredentials": []}
}
```

### 5. Validate
```bash
npx tsx scripts/auto-fix-workflow.ts workflow.json --write
npx tsx scripts/validate-workflow.ts workflow.json
npx tsx scripts/test-workflow.ts workflow.json
npx tsx scripts/import-workflow.ts workflow.json
```

## Critical Rules

1. returnValue + outputDisplay at `config` level
2. AI SDK needs `{"options": {...}}` wrapper
3. AI outputs: use `{{ai.content}}` for text
4. zipToObjects: ALL fields must be arrays
5. chat-input: needs `fields` array
6. Variables: `{{outputAs}}` not `{{stepId.outputAs}}`

## Common Triggers

**manual**: `{"type": "manual", "config": {}}`
**cron**: `{"type": "cron", "config": {}}` - User sets schedule via UI
**chat-input**: See reference/triggers.md

## Top Modules (73% usage)

**javascript.execute**: Transform data
**ai.ai-sdk.generateText**: `{"options": {"prompt": "...", "model": "gpt-4o-mini"}}`
**array-utils**: range, fill, zipToObjects, first, sum, average
**json-transform.parseJson**: Parse JSON strings

## Need More?

- All triggers: reference/triggers.md
- Credentials: reference/credentials.md
- All modules: reference/modules.md
- Examples: examples.md
- Errors: /fix-workflow
```

**workflow-fixer (200 lines):**

```markdown
# Workflow Fixer

**For building**: Use /workflow

## Validation Pipeline

```bash
# 1. Auto-fix
npx tsx scripts/auto-fix-workflow.ts workflow.json --write

# 2-3. Validate
npx tsx scripts/validate-workflow.ts workflow.json
npx tsx scripts/validate-output-display.ts workflow.json

# 4. Test
npx tsx scripts/test-workflow.ts workflow.json

# 5. Import
npx tsx scripts/import-workflow.ts workflow.json
```

## Common Errors

### Module Errors
**"Module not found"**: Re-search, check lowercase
**"Function not found"**: `npm run generate:registry`

### AI SDK Errors
**"options undefined"**: Need `{"options": {...}}`
**"maxTokens < 16"**: Set 20+
**String functions fail**: Use `{{ai.content}}`

### Variable Errors
**"Variable undefined"**: Check `outputAs` in previous steps
**Use**: `{{outputAs}}` not `{{stepId.outputAs}}`

### Array Errors
**"All fields must be arrays"**: zipToObjects needs arrays
❌ `"fields": "{{text}}"`
✅ `"fields": ["{{item1}}", "{{item2}}"]`

### Credential Errors
**"credential undefined"**: Check existing workflows for exact name
Common: `openai_api_key`, `twitter_oauth`, `rapidapi_api_key`

### Validation Errors
**"returnValue at config level"**: Not in outputDisplay
**"chat-input fields required"**: Must have fields array with id, label, key, type, required

### Execution Errors
**"Timeout"**: API slow, increase timeout
**"Rate limit"**: Add delays or reduce frequency
**"Network error"**: Check API status

## Testing

**Dry-run**: `--dry-run` flag (structure only)
**Full test**: Real execution + cleanup

## Debugging Steps

1. Read error message
2. Run auto-fix
3. Find error in catalog above
4. Apply fix
5. Re-validate
6. Test

## Advanced Topics

- Update workflows: reference/management.md
- Rate limiting: reference/advanced.md
- Parallelization: reference/advanced.md
- Control flow: reference/advanced.md
- Database ops: reference/advanced.md
```

---

## Comparison

| Metric | Current | Ultra-Lean | Savings |
|--------|---------|------------|---------|
| workflow-builder | 476 lines | 180 lines | 62% |
| workflow-fixer | 415 lines | 200 lines | 52% |
| Simple workflow context | 476 | 180 | 62% |
| Complex workflow context | 476 | 180-400 | 16-62% |
| Debugging context | 415 | 200 | 52% |

---

## Success Metrics

**Target reductions:**
- ✅ workflow-builder: 476 → 180 (-62%)
- ✅ workflow-fixer: 415 → 200 (-52%)
- ✅ Simple workflows: 80% cases use ≤200 lines
- ✅ Complex workflows: 20% cases use ≤400 lines

**What this achieves:**
- Optimizes for the 80% (simple workflows)
- Still handles 20% (complex workflows)
- Based on REAL usage patterns
- Uses existing examples.md pattern
- Minimal disruption

---

## Next Steps

1. Create reference/ directory with 5 files
2. Extract content from current skills
3. Rewrite workflow-builder to 180 lines
4. Rewrite workflow-fixer to 200 lines
5. Test with real workflow scenarios
6. Measure context size improvements

Ready to implement?
