# SKILLS.md Improvement Tracking

## Critical Fixes (Do First)

### 1. Missing Validation Workflow
- Current: Shows validate → import
- Fix: Document 5-step pipeline (auto-fix → validate → validate-output → test → import)
- Impact: LLMs skip auto-fix, 90% of errors not caught

### 2. Weak Technical Guardrails
- returnValue placement not emphasized (must be at config level)
- AI SDK min tokens ≥16 buried
- AI SDK .content access pattern not bold
- zipToObjects array requirement not emphasized
- chat-input field requirements vague

### 3. No Error Recovery Guide
- No "what to do when validation fails"
- No iterative debugging workflow
- LLMs give up after first error

### 4. Incomplete Credential Documentation
- Only shows `{{credential.X}}`
- Missing `{{user.X}}` and `{{X}}` syntaxes
- No common credential name reference

### 5. Missing Parameter Detection Rules
- No guidance on params vs options vs direct
- Should be signature-based flowchart
- Current: trial and error

## High Priority

### 6. No Common Errors Catalog
- Add "Errors & Solutions" section
- Include actual error messages
- Provide actionable fixes

### 7. Missing validate-output-display Step
- Only mentions validate-workflow
- Type compatibility checking skipped

### 8. No Credential Naming Table
- Common names: openai_api_key, twitter_oauth, rapidapi_api_key
- OAuth vs API key patterns unclear

### 9. Variable Interpolation Incomplete
- Only shows `{{var.prop}}`
- Missing array indexing: `{{var[0].field}}`

## Medium Priority

### 10. Testing Strategy Missing
- No --dry-run documentation
- No test output interpretation guide

### 11. OAuth Auto-Refresh Not Mentioned
- Tokens auto-refresh for Twitter, YouTube, GitHub
- Reduces manual credential management

### 12. Parallel Execution Hidden
- System auto-detects parallelizable steps
- No manual configuration needed

### 13. Module Category Mapping Unclear
- "Social Media" → social folder
- "Developer Tools" → devtools folder

### 14. Database Type Inference Not Explained
- string → TEXT
- number → INTEGER
- Date → TIMESTAMP

### 15. Control Flow Missing Entirely
- ConditionStep, ForEachStep, WhileStep
- maxIterations for loops

## Low Priority

### 16. Module Registry Sync
- When to run `npm run generate:registry`

### 17. Parameter Alias System
- limit → maxResults, query → search

### 18. Workflow Versioning
- Update vs create new

### 19. Rate Limiting Strategies
- No guidance on API rate limits

### 20. Cron Schedule Format
- Reference to crontab.guru or format guide

## Implementation Plan

1. Add validation workflow section with bold requirements
2. Add technical guardrails section (bold warnings)
3. Add common errors & solutions section
4. Add parameter detection flowchart
5. Add credential reference table
6. Enhance existing sections with missing details
7. Add advanced features section (control flow, parallel execution)
