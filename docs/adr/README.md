# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the StockAI project.

## What are ADRs?

Architecture Decision Records capture important architectural decisions made during the project lifecycle. Each ADR documents:

- **Context**: The situation that led to the decision
- **Decision**: What was decided
- **Consequences**: The impact of the decision

## Format

Each ADR follows this template:

```markdown
# ADR-XXXX: Title

**Status**: Accepted/Superseded/Deprecated
**Date**: YYYY-MM-DD
**Deciders**: Team member(s)

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing or have agreed to implement?

## Consequences
What becomes easier or more difficult to do and any risks introduced by this change?
```

## Naming Convention

ADRs are numbered sequentially:
- `0001-use-nextjs-for-frontend.md`
- `0002-alpha-vantage-for-stock-data.md`
- `0003-typescript-strict-mode.md`

## Current ADRs

| Number | Title | Status | Date |
|--------|-------|---------|------|
| [0001](./0001-portfolio-dashboard-implementation.md) | Portfolio Dashboard Implementation | Accepted | 2025-07-16 |
| [0002](./0002-week1-infrastructure-decisions.md) | Week 1 Infrastructure Setup | Accepted | 2025-07-16 |

## Index by Topic

### Frontend Architecture
- [ADR-0001: Portfolio Dashboard Implementation](./0001-portfolio-dashboard-implementation.md)

### Infrastructure & DevOps  
- [ADR-0002: Week 1 Infrastructure Setup](./0002-week1-infrastructure-decisions.md)