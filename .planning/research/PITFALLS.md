# Pitfalls Research

**Domain:** Procedural Integrity Score Dashboard for Federal Infrastructure Spending
**Researched:** February 2026
**Confidence:** MEDIUM-HIGH

## Critical Pitfalls

### Pitfall 1: Trusting USASpending.gov Data at Face Value

**What goes wrong:**
Dashboard displays USASpending.gov data as authoritative, but the data has known quality issues. GAO reports consistently find missing data, inconsistent reporting, and agencies not reporting at all.

**Why it happens:**
Developers assume government data is "clean" without understanding DATA Act implementation gaps. The API returns data from agency financial systems with varying degrees of compliance and timeliness.

**How to avoid:**
- Build data quality indicators into the dashboard (recency, completeness flags, source attribution)
- Document known data limitations prominently
- Add "data as of" timestamps with clear refresh schedules
- Implement warning indicators for projects with incomplete records

**Warning signs:**
- API returns null fields for key compliance indicators
- Award counts don't match agency totals
- Missing subaward data for grant-heavy agencies

**Phase to address:**
Data Integration Phase — validate data quality before building scoring on top of it

---

### Pitfall 2: Undefensible Scoring Methodology

**What goes wrong:**
Scoring methodology is challenged as subjective, biased, or methodologically unsound. Critics can poke holes in the scoring logic, undermining the entire product's credibility.

**Why it happens:**
Rushing to create scores without documenting methodology, peer review, or considering alternative interpretations. Transparency advocates and government watchdogs will scrutinize any scoring system.

**How to avoid:**
- Document every scoring component with legal/policy citations
- Publish full methodology with weights and rationales
- Include confidence intervals or uncertainty indicators
- Consider third-party validation or expert review
- Allow for public comment on methodology before launch

**Warning signs:**
- Stakeholders ask "how did you decide this?" and answer is ad-hoc
- No citations to statutory requirements or regulatory sources
- Scoring results don't pass "sniff test" against known high/low compliance cases

**Phase to address:**
Scoring Methodology Phase — methodology design and validation

---

### Pitfall 3: Ignoring IIJA-Specific Data Gaps

**What goes wrong:**
Dashboard assumes IIJA (Infrastructure Investment and Jobs Act) funding is fully represented in USASpending.gov, but IIJA data is incomplete. GAO reports specifically flag IIJA/DOT funding status communication issues.

**Why it happens:**
IIJA is relatively new (2021) and has different reporting mechanisms than traditional federal spending. Not all IIJA-funded projects are yet in the system, and obligation/outlay status can be confusing.

**How to avoid:**
- Research which IIJA programs report to USASpending.gov and which don't
- Clearly distinguish "obligated" vs "outlaid" vs "appropriated" amounts
- Add IIJA-specific data quality notes
- Consider supplementary sources for IIJA-specific data (DOT dashboards, state rollups)

**Warning signs:**
- Large IIJA programs missing from search results
- Funding amounts that seem too low compared to IIJA totals
- State-level data doesn't reconcile with state IIJA allocation announcements

**Phase to address:**
Data Integration Phase — understand IIJA-specific data landscape

---

### Pitfall 4: Building on Deprecated API Endpoints

**What goes wrong:**
USASpending.gov API is in V2 with V1 deprecated. Endpoint behavior changes, and key endpoints may be limited or have different response formats than documented.

**Why it happens:**
Relying on undocumented behavior or V1 endpoints. Not monitoring API announcements for deprecations.

**How to avoid:**
- Use only V2 endpoints documented at api.usaspending.gov/docs
- Build abstraction layer so API changes don't break dashboard
- Monitor USAspending community forums and GitHub for deprecation notices
- Test with bulk downloads for large datasets (API has pagination limits)

**Warning signs:**
- GitHub issues mention endpoint changes or deprecation
- API responses change format without notice
- Rate limiting or pagination issues on large queries

**Phase to address:**
API Integration Phase — robust API handling

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Cache USASpending data indefinitely | Fast dashboard loads | Stale data, wrong compliance scores | Only with clear staleness indicators |
| Skip data validation for API fields | Faster initial build | False compliance claims | Never — validation is core value |
| Hardcode scoring weights | Quick MVP | Can't adjust without rebuild | Only if weights are in config file |
| Direct API calls from frontend | Simpler architecture | Exposes API to rate limits, no caching | Never — always proxy server-side |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| USASpending.gov API | Not handling pagination for large result sets | Implement cursor-based pagination, batch requests |
| USASpending.gov API | Ignoring rate limits during bulk sync | Implement request throttling, queue system |
| USASpending.gov API | Treating API data as immediately fresh | Document refresh cycles, typically daily/weekly |
| Data transformation | Assuming field names stable | Map to internal schema, version external schemas |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all IIJA awards at once | Dashboard timeout, OOM errors | Paginate, virtualize lists, lazy load details | At 10K+ projects |
| Real-time API calls on search | Slow search, rate limit errors | Implement search debouncing, server-side caching | At 50+ concurrent users |
| Complex scoring calculations per view | Page load >5 seconds | Pre-compute scores, cache results | At scale without pre-computation |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing user emails insecurely | GDPR/CCPA violations, breach liability | Use encrypted email storage, minimal retention |
| Gated content with weak form validation | Spam leads, low-quality data | Email validation, rate limiting on submissions |
| Exposing internal API keys in frontend | Unauthorized USASpending API usage | Server-side only, environment variables |
| No Terms of Service for scoring | Legal liability for defamatory scores | Legal review, disclaimer, dispute resolution process |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|--------------|------------------|
| No explanation of what scores mean | Users misinterpret, lose trust | Hover tooltips, methodology links, plain-language guides |
| Scoring without context (e.g., "Score: 65") | Impossible to act on | Show component breakdown, comparisons to peers |
| Gated reports without preview | Low conversion, frustration | Show report summary, highlight key findings ungated |
| Complex filter combinations | Users can't find relevant data | Smart defaults, saved filters, clear filter UI |

---

## "Looks Done But Isn't" Checklist

- [ ] **USASpending Data:** Often missing subaward data — verify grants have subaward linkage
- [ ] **Compliance Indicators:** Often null for new awards — don't score without data
- [ ] **Timeline Data:** Often incomplete for multi-year projects — note data gaps in visualization
- [ ] **Agency Matching:** Often wrong due to agency code changes — validate against current codes
- [ ] **Geographic Data:** Often missing for grants — don't assume location data exists

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| Data quality issues discovered post-launch | HIGH | Add quality flags, transparent communication, data correction pipeline |
| Methodology challenged | MEDIUM | Document defensibility, engage experts, open methodology to feedback |
| API changes break integration | MEDIUM | Abstraction layer, monitoring, rapid response process |
| User trust damaged by scoring errors | HIGH | Corrections with transparency, audit trail, appeals process |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Trusting USASpending data at face value | Data Integration | Data quality audit, compare to GAO reports |
| Undefensible scoring methodology | Scoring Methodology | Expert review, legal review, stakeholder testing |
| IIJA-specific data gaps | Data Integration | Research IIJA reporting requirements |
| Deprecated API endpoints | API Integration | Abstraction layer, monitoring |
| Performance at scale | Frontend/Dashboard | Load testing, pagination testing |
| User trust/lead gen failures | Dashboard + Lead Gen | User testing, conversion funnel analysis |

---

## Sources

- GAO-24-106214: Federal Spending Transparency — Data quality issues with USASpending.gov
- GAO-24-106237: COVID-19 and Grant Subaward Data — 26% of non-COVID subawards had issues
- GAO-22-105427: OIG Data Quality Reports — 45/57 OIGs reported data quality issues
- GAO-25-107166: IIJA/DOT Funding Status — DOT communication issues
- USAspending.gov API Documentation — V2 endpoints, pagination, rate considerations
- InformationWeek: "Serious Design Failure at USAspending.gov" — Dashboard usability critique
- ITIF: "Federal IT Dashboard Falls Short" — Government dashboard failure modes
- POGO: "Blueprint to Fix Reporting of Federal Spending" — Transparency advocacy perspective
