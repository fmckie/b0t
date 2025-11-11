# Aggressive Optimization Plan

## Goal: Get to ~200-250 lines per skill

## Current State
- workflow-builder: 475 lines (too fat)
- workflow-fixer: 414 lines (too fat)
- **Total when building**: 475 lines in context

## Target State
- workflow-builder: **~200 lines** (LEAN process only)
- workflow-fixer: **~250 lines** (error solutions only)
- Static reference docs: Read on-demand via Read tool

---

## Strategy: Process-Driven Skills + Reference Docs

### New Architecture

```
.claude/skills/
  workflow-builder/
    SKILL.md                 # 200 lines - PURE PROCESS
  workflow-fixer/
    SKILL.md                 # 250 lines - PURE ERROR SOLUTIONS

docs/workflow/
  reference.md               # 150 lines - Structure templates, rules
  triggers.md                # 80 lines - All trigger configs
  credentials.md             # 60 lines - Credential patterns
  modules.md                 # 50 lines - Module categories
```

---

## workflow-builder: 475 → 200 lines (-58%)

### KEEP (Process only):
1. **Process steps** (50 lines)
   - Parse → Search → Build → Validate
   - Concrete actions, no reference

2. **Module parameter detection** (30 lines)
   - Signature-based rules
   - Quick reference table

3. **Critical rules** (40 lines)
   - Top 5 mistakes ONLY
   - One-line reminders

4. **Basic JSON template** (30 lines)
   - Bare minimum structure
   - Reference to docs for details

5. **Validation steps** (30 lines)
   - 6 commands
   - Brief what each does

6. **Troubleshooting pointer** (20 lines)
   - "Use /fix-workflow if errors"
   - "Read docs/workflow/*.md for details"

**Total: ~200 lines**

### CUT (Move to static docs):
- ❌ All trigger configuration examples → `docs/workflow/triggers.md`
- ❌ Step input format examples → `docs/workflow/reference.md`
- ❌ Variable reference examples → `docs/workflow/reference.md`
- ❌ All credential examples → `docs/workflow/credentials.md`
- ❌ Output display examples → `docs/workflow/reference.md`
- ❌ AI SDK examples → `docs/workflow/reference.md`
- ❌ Module categories list → `docs/workflow/modules.md`

**Cut: ~275 lines moved to docs**

---

## workflow-fixer: 414 → 250 lines (-40%)

### KEEP (Solutions only):
1. **Validation pipeline** (30 lines)
   - 6 steps with commands

2. **Error catalog** (150 lines)
   - 20+ errors with BRIEF solutions
   - Each error: 5-7 lines max
   - Focus on fix, not explanation

3. **Testing commands** (20 lines)
   - Dry-run vs full test
   - Brief interpretation guide

4. **Workflow management** (30 lines)
   - Update vs create new
   - Commands only

5. **Debugging workflow** (20 lines)
   - Step-by-step checklist

**Total: ~250 lines**

### CUT (Move or compress):
- ❌ Rate limiting strategies → User can ask if needed
- ❌ Advanced debugging (parallel, control flow) → Ask on-demand
- ❌ OAuth details → Mention auto-refresh, details on-demand
- ❌ Database operations details → Brief mention only

**Cut: ~164 lines compressed or removed**

---

## Static Reference Docs Strategy

### How LLM Uses Them:
```
User: "Create a cron workflow"
→ workflow-builder loads (200 lines)
→ LLM sees: "For trigger configs, read docs/workflow/triggers.md"
→ LLM uses Read tool: Read docs/workflow/triggers.md
→ Gets trigger examples (80 lines)
→ Total context: 200 + 80 = 280 lines (still 40% less than 475!)
```

### docs/workflow/reference.md (~150 lines)
- Complete JSON structure with ALL fields
- Step input formats (params/options/direct)
- Variable reference patterns (nested, arrays, inline)
- Output display types with examples
- AI SDK complete examples
- returnValue and outputDisplay rules

### docs/workflow/triggers.md (~80 lines)
- All 9 trigger types with full configs
- When to use each
- Field requirements
- Access patterns (trigger.X)

### docs/workflow/credentials.md (~60 lines)
- 3 credential syntaxes with examples
- Common credential names table
- OAuth vs API key patterns
- Check existing workflows command

### docs/workflow/modules.md (~50 lines)
- 16 categories with descriptions
- Folder name mapping
- Search strategies
- Parameter detection detailed guide

---

## Even More Aggressive: workflow-builder → 150 lines

### Ultra-lean process:
```markdown
# Workflow Builder

## Process
1. Parse: What data → Transform → When
2. Search: `npx tsx scripts/search-modules.ts "keyword"`
3. Detect params: Check signature → params/options/direct
4. Build JSON: See docs/workflow/reference.md
5. Validate: Run 6 commands (auto-fix → validate → test → import)

## Critical Rules (Top 5)
1. returnValue at config level
2. AI SDK needs options wrapper + .content
3. zipToObjects needs arrays
4. chat-input needs fields
5. Variables: {{outputAs}} not {{stepId.outputAs}}

## Parameter Detection
- AI SDK → options
- (params: ...) → params wrapper
- (options: ...) → options wrapper
- (arg1, arg2) → direct

## Validation Commands
```bash
npx tsx scripts/auto-fix-workflow.ts workflow/{name}.json --write
npx tsx scripts/validate-workflow.ts workflow/{name}.json
npx tsx scripts/validate-output-display.ts workflow/{name}.json
npx tsx scripts/test-workflow.ts workflow/{name}.json
npx tsx scripts/import-workflow.ts workflow/{name}.json
```

## Need Help?
- Structure/examples: Read docs/workflow/reference.md
- Triggers: Read docs/workflow/triggers.md
- Credentials: Read docs/workflow/credentials.md
- Modules: Read docs/workflow/modules.md
- Errors: Use /fix-workflow
```

**Total: ~150 lines**

---

## Comparison

| Version | workflow-builder | workflow-fixer | Static Docs | Total (if all loaded) |
|---------|-----------------|----------------|-------------|---------------------|
| Original single | 737 | - | - | 737 |
| Current split | 475 | 414 | - | 889 |
| **Aggressive** | **200** | **250** | 340 | 790 |
| **Ultra-lean** | **150** | **250** | 390 | 790 |

### Context When Building Workflow:

| Scenario | Original | Current Split | Aggressive | Ultra-lean |
|----------|---------|---------------|------------|-----------|
| **Simple workflow** | 737 | 475 | 200 | 150 |
| **Need trigger help** | 737 | 475 | 200 + 80 = 280 | 150 + 80 = 230 |
| **Need credential help** | 737 | 475 | 200 + 60 = 260 | 150 + 60 = 210 |
| **Need full reference** | 737 | 475 | 200 + 150 = 350 | 150 + 150 = 300 |

**Aggressive/Ultra-lean wins in ALL scenarios!**

---

## Recommendation: Ultra-Lean (150 + 250 lines)

### Why Ultra-Lean:
1. **150 lines for building** - Pure process, no fluff
2. **LLM reads docs on-demand** - Only when needed
3. **Typical workflow**: 150-300 lines context (vs 475-737 now)
4. **50-80% context reduction** for most workflows
5. **Forces separation** - Process in skill, reference in docs

### Implementation:
1. Create docs/workflow/*.md files (4 files, ~340 lines total)
2. Strip workflow-builder to 150 lines (pure process)
3. Strip workflow-fixer to 250 lines (error solutions only)
4. Both skills reference docs when needed

### Risks:
- LLM might forget to read docs
- Add explicit "Read docs/workflow/X.md" at each step

### Mitigation:
```markdown
## Step 3: Build Trigger
Read docs/workflow/triggers.md for all trigger configurations.
Then build the trigger config for type: {{triggerType}}
```

Explicit read instructions at each step.

---

## Even More Radical: Single Ultra-Lean Skill (200 lines)

### Controversial take:
Maybe we don't need the split at all. Maybe we need:

**workflow-master** (200 lines):
- Process for building (100 lines)
- Error solutions (100 lines)
- References to docs/workflow/*.md for everything else

**Pros:**
- Single command: `/workflow`
- 200 lines always (vs 475-737)
- Simpler for users
- LLM has both building + debugging in one context

**Cons:**
- Mixed concerns again
- 100 lines for errors might be too brief

---

## My Recommendation

**Go Ultra-Lean Split:**
- workflow-builder: 150 lines (pure process)
- workflow-fixer: 250 lines (error solutions)
- docs/workflow/*.md: 340 lines (reference on-demand)

**Why:**
- 50-80% context reduction for real workflows
- Clear separation still maintained
- On-demand reference loading = best of both worlds
- Forces discipline: Process in skill, reference in docs

Want me to implement this?
