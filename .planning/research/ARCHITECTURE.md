# Architecture Research

**Domain:** Federal Spending Data Dashboard with Compliance Scoring
**Researched:** 2026-02-20
**Confidence:** MEDIUM-HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Dashboard   │  │    Search    │  │   Timeline   │  │ Lead Gate   │   │
│  │   Widgets    │  │  Components  │  │   Viewer     │  │   Modal     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │            │
├─────────┴─────────────────┴─────────────────┴─────────────────┴────────────┤
│                           API GATEWAY / BFF LAYER                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Dashboard   │  │   Scoring    │  │   Search     │  │   Lead Gen   │   │
│  │    API       │  │    API       │  │    API       │  │    API       │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────────┘
          │                 │                 │                 │
┌─────────┴─────────────────┴─────────────────┴─────────────────┴────────────┐
│                           SERVICE LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   USASpend   │  │   Scoring    │  │   Project    │  │   Email      │   │
│  │   Ingestion  │  │   Engine     │  │   Store      │  │   Service    │   │
│  │   Service    │  │   Service    │  │   Service    │  │   Service    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────┬─────────────────┬─────────────────┬─────────────────┬────────────┘
          │                 │                 │                 │
┌─────────┴─────────────────┴─────────────────┴─────────────────┴────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │    Redis      │  │  Object      │  │  External    │   │
│  │  (Projects,  │  │  (Cache,      │  │  Storage     │  │  APIs        │   │
│  │   Scores,    │  │   Session)    │  │  (Reports)   │  │  (USASpend)  │   │
│  │   Leads)     │  │               │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Dashboard Widgets** | Display scores, charts, maps; handle user interactions | React components with Chart.js/Recharts |
| **Search Components** | Filter UI (state, agency, project type); build query params | React Query Builder pattern |
| **Timeline Viewer** | Gantt-style project timeline visualization | D3.js or specialized timeline library |
| **Lead Gate Modal** | Email capture form before premium content | React Hook Form + validation |
| **Dashboard API (BFF)** | Aggregate data for frontend; transform USASpending responses | Next.js API routes or Express |
| **Scoring API** | Execute scoring rules; return compliance scores | Node.js service with rule engine |
| **USASpending Ingestion** | Fetch data from USASpending.gov API; normalize | Scheduled jobs + streaming parser |
| **Scoring Engine** | Apply procedural compliance rules; compute scores | Rules-based engine (json-rules-engine) |
| **Project Store Service** | CRUD for project data and scores | PostgreSQL with Prisma/Drizzle ORM |
| **Email Service** | Send gated reports; manage subscriptions | Resend, SendGrid, or AWS SES |

## Recommended Project Structure

```
src/
├── api/                      # BFF / API Gateway layer
│   ├── dashboard/           # Dashboard aggregation endpoints
│   ├── scoring/             # Scoring engine endpoints
│   ├── search/              # Search/filter endpoints
│   └── leads/               # Lead capture endpoints
├── services/                # Core business logic
│   ├── usaspending/        # USASpending API client & ingestion
│   ├── scoring/            # Compliance scoring engine
│   ├── projects/           # Project data management
│   └── email/              # Email delivery service
├── data/                    # Data layer
│   ├── db/                 # Database schema (Prisma/Drizzle)
│   ├── repositories/      # Data access objects
│   └── cache/              # Redis cache utilities
├── components/             # React components
│   ├── dashboard/          # Dashboard widgets
│   ├── search/             # Filter components
│   ├── timeline/          # Timeline visualization
│   └── gates/              # Lead capture modals
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & shared code
│   ├── scoring/            # Scoring rule definitions
│   └── types/             # TypeScript types
└── scripts/                # One-off scripts (ingestion jobs)
```

### Structure Rationale

- **api/**: Separates frontend data aggregation from business logic, enabling independent scaling
- **services/**: Core domain logic isolated for testability and reuse
- **data/**: Database schema and repositories in one place for migration management
- **components/**: UI components organized by feature domain
- **lib/scoring/**: Scoring rules isolated for easy updates and audit trails

## Architectural Patterns

### Pattern 1: BFF (Backend-for-Frontend)

**What:** Dedicated API layer per frontend experience that aggregates multiple downstream services.

**When to use:** When the frontend needs data from USASpending API + scoring engine + project store in a single request.

**Trade-offs:**
- Pro: Reduces frontend complexity, enables team ownership boundaries
- Con: Duplication risk if not careful, additional infrastructure

```typescript
// api/dashboard/route.ts (Next.js App Router)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')
  const agency = searchParams.get('agency')

  // Parallel fetch from multiple services
  const [projects, scores, totals] = await Promise.all([
    projectService.search({ state, agency }),
    scoringService.getScoresByFilter({ state, agency }),
    usaspendingService.getTotals({ state, agency })
  ])

  return Response.json({ projects, scores, totals })
}
```

### Pattern 2: Event-Driven Scoring Updates

**What:** Scoring recalculations triggered by data updates rather than on-demand.

**When to use:** When scoring is computationally expensive and data updates are batched.

**Trade-offs:**
- Pro: Fast read responses, complex scoring can run asynchronously
- Con: eventual consistency, more complex debugging

### Pattern 3: Progressive Gating

**What:**分层 gate that reveals progressively more detail as user provides more information.

**When to use:** Lead generation on data-heavy dashboards.

**Trade-offs:**
- Pro: Higher conversion than hard gates, builds trust
- Con: Requires thoughtful UX to avoid frustration

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC (0 leads)                     │
│   - Summary scores by state/agency                     │
│   - High-level dashboard overview                      │
├─────────────────────────────────────────────────────────┤
│                 EMAIL CAPTURE (1 lead)                  │
│   - Detailed project list                              │
│   - Basic filtering                                    │
│   - Score breakdowns                                   │
├─────────────────────────────────────────────────────────┤
│              FULL ACCESS (qualified lead)               │
│   - Exportable reports                                 │
│   - Timeline visualization                             │
│   - Advanced filters                                   │
│   - Self-assessment tool                              │
└─────────────────────────────────────────────────────────┘
```

### Pattern 4: Rules Engine for Compliance Scoring

**What:** Declarative rule definitions executed by a rules engine rather than hard-coded logic.

**When to use:** When scoring methodology must be transparent, auditable, and defensible.

**Trade-offs:**
- Pro: Easy to audit, modify without code changes, defensible
- Con: Additional abstraction layer, potential performance overhead

```typescript
// lib/scoring/rules.ts
export const proceduralComplianceRules = [
  {
    id: 'timely-reporting',
    name: 'Timely Financial Reporting',
    description: 'Agency submitted quarterly reports within 30 days of deadline',
    weight: 0.25,
    evaluate: (project: ProjectData): number => {
      const daysLate = differenceInDays(project.reportDeadline, project.reportSubmitted)
      return daysLate <= 0 ? 1 : Math.max(0, 1 - (daysLate / 90))
    }
  },
  {
    id: 'funding-obligation',
    name: 'Funding Obligation Rate',
    description: 'Percentage of allocated funds obligated within required timeframe',
    weight: 0.30,
    evaluate: (project: ProjectData): number => {
      return project.obligatedAmount / project.totalAllocated
    }
  },
  {
    id: 'deadline-compliance',
    name: 'Milestone Deadline Compliance',
    description: 'Percentage of milestones completed on or before deadline',
    weight: 0.20,
    evaluate: (project: ProjectData): number => {
      const onTime = project.milestones.filter(m => !m.isLate).length
      return onTime / project.milestones.length
    }
  },
  {
    id: 'reporting-completeness',
    name: 'Reporting Completeness',
    description: 'All required data elements submitted in reports',
    weight: 0.15,
    evaluate: (project: ProjectData): number => {
      return project.submittedElements / project.requiredElements
    }
  },
  {
    id: 'public-documentation',
    name: 'Public Documentation Availability',
    description: 'Required public documents (NOOs, environmental reviews) posted',
    weight: 0.10,
    evaluate: (project: ProjectData): number => {
      return project.availableDocs / project.requiredDocs
    }
  }
]
```

## Data Flow

### Primary Flow: Dashboard Data Request

```
[User visits dashboard]
        ↓
[React Query fetches /api/dashboard]
        ↓
[BFF layer parses filters: state, agency, projectType, dateRange]
        ↓
[┌─────────────────────────────────────────────────────────┐]
[│  PARALLEL FETCH:                                        ]
[│  1. ProjectStore.search(filters) → project IDs         ]
[│  2. ScoringService.getScores(projectIds) → scores       ]
[│  3. USASpendingService.getTotals(filters) → totals      ]
[└─────────────────────────────────────────────────────────┘]
        ↓
[BFF aggregates: merges project + scores + totals]
        ↓
[Response to frontend with pagination metadata]
        ↓
[React Query caches, components render]
```

### Secondary Flow: Scoring Engine Execution

```
[Scheduled Job: Daily at 2 AM]
        ↓
[USASpendingIngestionService.fetchLatestProjects()]
        ↓
[Normalize and store in ProjectStore]
        ↓
[ScoringService.triggerRecalculation(projectIds)]
        ↓
[For each project:]
  1. Load project data from ProjectStore
  2. Load USASpending reference data (reports, milestones)
  3. Execute proceduralComplianceRules against project
  4. Calculate weighted score
  5. Store in ProjectStore.scores table
        ↓
[Cache invalidation: Clear Redis dashboard cache]
```

### Lead Generation Flow

```
[User clicks "View Detailed Report"]
        ↓
[Check session for lead_id]
        ↓
[IF no lead_id:]
  [Show Gate Modal]
  [User submits email]
  [LeadService.create({email, source: 'report_download'})]
  [Set session cookie]
  [Proceed to detailed view]
[ELSE:]
  [Proceed to detailed view]
```

### Self-Assessment Tool Flow

```
[User accesses /assessment]
        ↓
[FormGate: Check if user has completed assessment]
        ↓
[Display assessment wizard]
  - Step 1: Agency context
  - Step 2: Project selection
  - Step 3: Compliance checklist
  - Step 4: Generate score + recommendations
        ↓
[Save to ProjectStore.assessments]
        ↓
[Optional: Email report to user]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1K users | Monolith with PostgreSQL + Redis is fine. All services in single repo. |
| 1K-100K users | Add read replicas for PostgreSQL. Consider separating scoring service to background jobs (BullMQ). CDN for static assets. |
| 100K+ users | Split into microservices: ingestion service, scoring service, API service. Consider data warehouse (ClickHouse) for analytics queries. |

### Scaling Priorities

1. **First bottleneck:** Dashboard query performance with filters
   - **How to fix:** Add composite indexes on (state, agency, projectType), implement Redis caching for frequent queries

2. **Second bottleneck:** Scoring engine recalculation time
   - **How to fix:** Move to background job queue, implement incremental scoring (only recalculate changed projects)

3. **Third bottleneck:** USASpending API rate limits
   - **How to fix:** Implement request queuing with rate-limit handling, cache aggressively, consider official data dump downloads instead of API

## Anti-Patterns

### Anti-Pattern 1: Calling USASpending API Directly from Frontend

**What people do:** Building frontend that directly queries USASpending.gov API for every user request.

**Why it's wrong:** Exposes API keys (if required), hits rate limits, poor caching, no transformation layer for domain-specific needs.

**Do this instead:** Build BFF layer that aggregates, caches, and transforms USASpending data.

### Anti-Pattern 2: Hard-Coded Scoring Logic

**What people do:** Writing scoring calculations as if/else statements in application code.

**Why it's wrong:** Makes methodology opaque, difficult to audit, hard to update without redeployment.

**Do this instead:** Use declarative rules engine with scoring rules in version-controlled configuration.

### Anti-Pattern 3: No Caching Layer

**What people do:** Querying database and USASpending API on every dashboard load.

**Why it's wrong:** Dashboard feels slow, hits rate limits, expensive compute on every request.

**Do this instead:** Implement Redis caching with TTL, invalidate on data updates.

### Anti-Pattern 4: Single-Tier Gating

**What people do:** Blocking all content behind single email gate.

**Why it's wrong:** Low conversion, users leave without seeing any value.

**Do this instead:** Progressive gating—show summary, gate details, gate exports at separate stages.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **USASpending.gov API** | REST client with rate-limit handling | Endpoints: /api/v2/search/, /api/v2/reporting/, /api/v2/awards/. Rate limit: ~5000/day for bulk, implement backoff. |
| **Email Provider (Resend/SendGrid)** | Transactional email API | Send gated reports, assessment results. |
| **Analytics (optional)** | Client-side event tracking | Track gated content interactions for funnel analysis. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Frontend ↔ BFF | REST/GraphQL | BFF transforms external API responses into frontend-friendly shapes |
| BFF ↔ Services | Direct function calls | In monolith, import services. In microservices, use message queue or gRPC |
| Scoring Service ↔ DB | ORM queries | scoring_service reads project data, writes score results |
| Ingestion ↔ Scoring | Event/message | When new projects arrive, emit event to trigger scoring |

## Build Order Dependencies

```
Phase 1: Foundation
├── Set up Next.js project with database (PostgreSQL + Prisma)
├── Define schema: projects, scores, leads
└── Basic landing page

Phase 2: Data Ingestion
├── USASpending API client
├── Scheduled ingestion job (daily sync)
├── Data normalization layer
└── Store projects in PostgreSQL

Phase 3: Scoring Engine
├── Rules engine setup (json-rules-engine)
├── Define procedural compliance rules
├── Scoring job: calculate scores for all projects
└── Store scores in PostgreSQL

Phase 4: Dashboard UI
├── Dashboard layout and navigation
├── Summary widgets (state/agency rollups)
├── Basic search/filter components
└── BFF endpoints for dashboard data

Phase 5: Advanced Features
├── Timeline visualization
├── Detailed project views
├── Score breakdown UI
└── Export functionality

Phase 6: Lead Generation
├── Email capture modal (progressive gate)
├── Lead storage and tracking
├── Email delivery for reports
└── Self-assessment form wizard
```

### Key Dependencies

1. **Scoring requires:** Ingested project data → Scoring must come after ingestion
2. **Dashboard requires:** Project data + Scores → Must come after both data and scoring
3. **Lead gates require:** Dashboard to gate → Must come after dashboard basics
4. **Self-assessment requires:** Scoring rules defined → Must come after scoring engine

---

*Architecture research for: Procedural Integrity Score Dashboard*
*Researched: 2026-02-20*
