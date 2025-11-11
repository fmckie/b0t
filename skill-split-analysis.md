# Workflow Skills Split Analysis

## Current State
- **Single skill**: `workflow-generator` (737 lines)
- **Single command**: `/workflow`
- **Problem**: Too large for reliable LLM processing, mixing concerns

## Proposed Split Options

### Option A: Build vs Fix (Recommended)

| Aspect | **workflow-builder** | **workflow-fixer** |
|--------|---------------------|-------------------|
| **Purpose** | Create new workflows from scratch | Debug, fix, and validate existing workflows |
| **Lines** | ~350 lines | ~250 lines |
| **Commands** | `/build-workflow` or `/new-workflow` | `/fix-workflow` or `/debug-workflow` |
| **When Used** | "create a workflow", "build automation" | "workflow failing", "fix errors", "validation failed" |
| **Core Content** | • Parse request<br>• Search modules<br>• Build JSON structure<br>• Trigger configurations<br>• Step examples<br>• Credential syntax<br>• Variable references | • Complete error catalog (20+ errors)<br>• Auto-fix pipeline<br>• Validation workflow<br>• Debugging strategies<br>• Test output interpretation<br>• Error recovery steps |
| **Focus** | **Creation & structure** | **Debugging & recovery** |
| **Activation** | User wants NEW workflow | User has BROKEN workflow or validation errors |
| **References** | Module search, parameter detection, structure templates | Error solutions, validation steps, testing |
| **Shared Docs** | Both reference `workflow-reference.md` for common rules |

### Option B: Build vs Validate vs Fix

| Aspect | **workflow-builder** | **workflow-validator** | **workflow-fixer** |
|--------|---------------------|----------------------|-------------------|
| **Purpose** | Create workflows | Run validation pipeline | Fix specific errors |
| **Lines** | ~300 lines | ~200 lines | ~200 lines |
| **Commands** | `/build-workflow` | `/validate-workflow` | `/fix-workflow` |
| **When Used** | "create workflow" | "validate this", "test workflow" | "error X", "failing" |
| **Content** | Module search, JSON building, examples | Validation steps, auto-fix, testing | Error catalog, solutions |
| **Pro** | Very focused, single responsibility | Clear validation phase | Targeted debugging |
| **Con** | Need 3 skills, more complex handoffs | May be unnecessary middle step | - |

### Option C: Generate vs Reference (Alternative)

| Aspect | **workflow-generator** | **workflow-reference** |
|--------|----------------------|----------------------|
| **Purpose** | Interactive workflow creation | Quick reference documentation |
| **Lines** | ~400 lines (process-focused) | ~300 lines (reference tables) |
| **Commands** | `/workflow` (keep existing) | `/workflow-help` or `/workflow-docs` |
| **When Used** | Building workflows | Looking up syntax, errors, examples |
| **Content** | Process steps, interaction flow | Technical guardrails, error catalog, trigger/credential tables |
| **Pro** | Keeps existing flow, just extracts reference | Clean separation |
| **Con** | Still relatively large generator | - |

### Option D: Skill + Static Reference File

| Aspect | **workflow-generator** (SKILL) | **workflow-rules.md** (Static) |
|--------|------------------------------|------------------------------|
| **Purpose** | Workflow creation process | Technical reference |
| **Lines** | ~350 lines | ~400 lines (not in context) |
| **Type** | Active skill (always loaded) | Passive doc (referenced when needed) |
| **Commands** | `/workflow` | LLM reads when needed via Read tool |
| **Content** | Process, search, build, validate | Rules, errors, examples, tables |
| **Pro** | Small active context, large reference available | Most flexible |
| **Con** | LLM must remember to read reference | - |

---

## Detailed Content Breakdown

### Current 737 Lines Categorized

| Section | Lines | Category | Split To |
|---------|-------|----------|----------|
| Process (Parse/Search/Build) | ~100 | Creation | **builder** |
| Module Parameter Detection | ~15 | Creation | **builder** |
| Critical Requirements (Guardrails) | ~30 | Reference | **fixer** or **reference** |
| Trigger Configurations | ~80 | Creation | **builder** |
| Step Input Formats | ~40 | Creation | **builder** |
| Variable References | ~30 | Creation | **builder** |
| Credentials | ~50 | Creation | **builder** |
| Output Display | ~40 | Creation | **builder** |
| AI SDK Examples | ~30 | Creation | **builder** |
| Key Rules Summary | ~20 | Reference | **fixer** or **reference** |
| **Common Errors & Solutions** | ~100 | **Debugging** | **fixer** ⭐ |
| **Testing Strategy** | ~40 | **Debugging** | **fixer** ⭐ |
| **Advanced Features** | ~80 | Reference | **reference** or **fixer** |
| **Workflow Management** | ~50 | Reference | **reference** or **fixer** |
| Module Categories | ~30 | Reference | **reference** |

**⭐ = High-value split candidates**

---

## Recommendation Matrix

| Option | Simplicity | Context Efficiency | User Experience | Maintenance |
|--------|-----------|-------------------|----------------|-------------|
| **A: Build vs Fix** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| B: Build/Validate/Fix | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| C: Generate vs Reference | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| D: Skill + Static File | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## **RECOMMENDED: Option A (Build vs Fix)**

### New Structure

```
.claude/
├── commands/
│   ├── workflow.md              # Interactive builder (calls workflow-builder skill)
│   ├── fix-workflow.md          # Error debugging (calls workflow-fixer skill)
│   └── commit.md
├── skills/
│   ├── workflow-builder/
│   │   └── SKILL.md            # ~350 lines - CREATION FOCUSED
│   └── workflow-fixer/
│       └── SKILL.md            # ~250 lines - DEBUGGING FOCUSED
```

### `/workflow` Command (workflow-builder skill)
**Focus**: Creating new workflows from user requests
**Size**: ~350 lines

**Contents**:
1. Process (Parse → Search → Build → Validate)
2. Module search & parameter detection
3. JSON structure templates
4. Trigger configurations (all types)
5. Step input formats (params/options/direct)
6. Variable references (basic + advanced)
7. Credentials (3 syntaxes + common names)
8. Output display types
9. AI SDK examples
10. Basic validation steps (auto-fix → validate → test → import)
11. Key rules summary (what to do, not debugging)

**Activation Triggers**:
- "create a workflow"
- "build workflow"
- "make automation"
- "schedule task"

### `/fix-workflow` Command (workflow-fixer skill)
**Focus**: Debugging, validation, and error recovery
**Size**: ~250 lines

**Contents**:
1. Complete validation pipeline (6 steps with detail)
2. Error catalog (20+ errors with solutions):
   - Module errors
   - AI SDK errors
   - Variable errors
   - Array/data errors
   - Credential errors
   - Validation errors
3. Testing strategy (dry-run vs full test)
4. Auto-fix capabilities and when to use
5. Registry sync troubleshooting
6. Workflow management (update vs create new)
7. Rate limiting strategies
8. Advanced debugging (control flow, parallel execution issues)

**Activation Triggers**:
- "workflow failing"
- "validation error"
- "fix my workflow"
- "debug workflow"
- "error: [any error message]"

### Shared Reference (Optional)
`docs/workflow-reference.md` - Static file both can reference:
- Module categories (16 domains)
- Advanced features (control flow, parallel execution)
- Technical guardrails (quick reference)

---

## Why Option A is Best

| Benefit | Explanation |
|---------|-------------|
| **Clear separation** | Creation vs debugging are distinct mental models |
| **Context efficiency** | Each skill <400 lines, well under LLM limits |
| **User intent alignment** | Users know if they're building or fixing |
| **No duplicate content** | Each skill has unique purpose |
| **Simple handoff** | Builder says "run /fix-workflow if errors" |
| **Maintenance** | Easy to update - errors go to fixer, examples go to builder |
| **Backwards compatible** | `/workflow` still works for building |

---

## Implementation Steps

1. **Create workflow-builder skill** (~350 lines)
   - Extract: Process, search, build, examples, triggers, credentials
   - Add: "If errors occur, use /fix-workflow command"

2. **Create workflow-fixer skill** (~250 lines)
   - Extract: Error catalog, validation pipeline, testing, debugging
   - Add: "To create new workflow, use /workflow command"

3. **Create commands**
   - `/workflow` → calls workflow-builder skill
   - `/fix-workflow` → calls workflow-fixer skill

4. **Update existing workflows**
   - Add pointer in workflow-builder to fixer
   - Add pointer in fixer to builder

5. **Optional: Create shared reference**
   - `docs/workflow-reference.md` for advanced topics
   - Both skills can reference it

---

## Alternative: Keep Single Skill with Sections

If splitting is too complex, optimize current structure:

### Streamlined Single Skill (~500 lines)

1. **Essential Process** (150 lines)
   - Parse, search, build, validate - COMPACT
2. **Quick Reference Tables** (100 lines)
   - Triggers, parameters, credentials - TABLES ONLY
3. **Common Errors** (150 lines)
   - Top 10 errors only (not 20+)
4. **Examples** (100 lines)
   - 5 key patterns

**Move to separate docs**:
- Advanced features → `docs/workflow-advanced.md`
- Complete error catalog → `docs/workflow-errors.md`
- Module categories → `docs/modules.md`

---

## My Recommendation

**Go with Option A: Build vs Fix**

**Reasons**:
1. Clean separation of concerns
2. Each skill stays focused and small (<400 lines)
3. Users naturally think "I'm building" or "I'm debugging"
4. Easy to maintain and extend
5. Better context efficiency for LLMs
6. No need for complex middleware/routing

**Commands**:
- `/workflow` - Build new workflows (workflow-builder)
- `/fix-workflow` - Debug and fix (workflow-fixer)

This gives you laser-focused skills while keeping the system simple!
