-- Seed initial documents into the vault

-- Worker Handbook (FrontierAgency)
INSERT OR IGNORE INTO documents (id, title, category, content_type, content, file_size, created_by)
VALUES (
  'doc_handbook_001',
  'Worker Handbook',
  'handbook',
  'markdown',
  '# Frontier Agency Worker Handbook

## Welcome

This handbook outlines the standard operating procedures, policies, and guidelines for all Frontier Agency staff.

## Our Mission

Frontier Agency builds personalized AI agencies for businesses of every size. We design, build, and deploy custom AI operations on demand.

## Core Principles

1. **Build useful AI, not hype** — Every project must deliver measurable value
2. **Own the infrastructure** — We control the full technology stack
3. **Move fast, ship real products** — Speed matters, but not at the cost of quality
4. **Build to get clients, not for clients** — We create products that attract customers

## Roles & Permissions

### Admin
- Full system access
- Manage staff accounts
- View all client and financial data
- Configure system settings

### Staff
- Manage client accounts
- Create and manage invoices
- Access document vault
- Cannot manage other staff

### Client
- View own invoices and projects
- Cannot access admin functions

## Service Delivery Process

### 1. Discovery
- Client intake call
- Needs assessment
- Scope definition
- Proposal generation

### 2. Build
- Architecture design
- Development sprints
- Regular client check-ins
- Testing and QA

### 3. Deploy
- Production deployment
- Client training
- Documentation handoff
- Go-live support

### 4. Operate
- Ongoing monitoring
- Performance optimization
- Regular reporting
- Iterative improvements

## Communication Standards

- Respond to client messages within 4 business hours
- Weekly status updates for active projects
- Monthly reports for retainer clients
- Escalation to admin for any client concerns

## Quality Standards

- All code must be reviewed before deployment
- Client data must be encrypted in transit and at rest
- Regular security audits
- Document all work in project management system',
  2048,
  NULL
);

-- Miami Agencies Competitive Intelligence
INSERT OR IGNORE INTO documents (id, title, category, content_type, content, file_size, created_by)
VALUES (
  'doc_intel_001',
  'Miami AI Agencies Competitive Intelligence',
  'intelligence',
  'markdown',
  '# Miami AI Agencies — Competitive Intelligence

## Overview

This document contains competitive intelligence on AI agencies and AI-related businesses operating in the Miami metropolitan area. Use this to identify market opportunities, competitive positioning, and potential partnership targets.

## Market Landscape

Miami has emerged as a growing tech hub with significant interest in AI and machine learning applications across real estate, finance, healthcare, and hospitality sectors.

## Key Competitors

### Direct Competitors (AI Agencies)
- Local AI consulting firms
- Digital marketing agencies offering AI services
- Custom software shops with AI capabilities

### Indirect Competitors
- In-house AI teams at large Miami enterprises
- Offshore AI development firms serving Miami clients
- No-code/low-code platforms enabling DIY AI

## Market Opportunities

### Underserved Sectors
1. **Small & Medium Businesses** — Most AI agencies focus on enterprise. SMBs are largely unserved.
2. **Real Estate** — Miami''s real estate market is massive but AI adoption is early.
3. **Healthcare** — Growing telemedicine and health tech scene needs AI automation.
4. **Hospitality & Tourism** — Hotels, restaurants, and tourism businesses need AI for operations.

### Competitive Advantages to Leverage
- Local presence and understanding of Miami market
- Bilingual capabilities (English/Spanish)
- Personalized service vs. large agency impersonality
- Faster turnaround than offshore alternatives

## Pricing Intelligence

| Service | Market Rate (Miami) | Our Target |
|---|---|---|
| AI Automation Consultation | $150-300/hr | $200/hr |
| Custom AI Agent Development | $5,000-50,000 | Project-based |
| Monthly Retainer (AI Ops) | $2,000-10,000/mo | $3,000-15,000/mo |
| Integration Projects | $2,000-20,000 | Project-based |

## Target Client Profiles

### Ideal Client Profile A — Real Estate
- Brokerage with 10-50 agents
- Currently using basic CRM
- Interested in AI for lead scoring and follow-up
- Budget: $3,000-8,000/month

### Ideal Client Profile B — Professional Services
- Law firm, accounting practice, or medical group
- 20-200 employees
- Needs document processing and client communication automation
- Budget: $5,000-15,000/month

### Ideal Client Profile C — E-commerce
- Online retailer based in Miami
$1M-$20M annual revenue
- Needs AI for customer service, recommendations, inventory
- Budget: $2,000-10,000/month',
  1536,
  NULL
);
