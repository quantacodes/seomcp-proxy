---
name: seo-mcp-reports
description: Generate professional, visually stunning SEO reports using SEO-MCP tools. Use when generating HTML/PDF SEO reports with charts, metric cards, gradient headers, and agency-quality styling. Covers weekly, monthly, quarterly, technical audit, competitive analysis, and client-friendly agency report formats. Requires SEO-MCP server connected. Triggers on "SEO report," "generate report," "weekly SEO report," "monthly SEO summary," "quarterly audit," "technical SEO check," "client report," "agency report," or "beautiful SEO report."
---

# SEO Report Generator

Generate agency-quality HTML+Chart.js SEO reports using SEO-MCP tools. Reports are designed to be opened in a browser and printed to PDF via Cmd+P / Ctrl+P.

## Report Types

| Type | API Calls | Time | Pages | Keywords | Best For |
|------|-----------|------|-------|----------|----------|
| Weekly | 5 | 10 min | 2-3 | 50 | Regular monitoring |
| Monthly | 10+ | 30 min | 10-12 | 200 | Client deliverables |
| Quarterly | 25+ | 2 hrs | 15-20 | 1000+ | Strategy reviews |
| Technical | 8+ | 20 min | 5-7 | N/A | Troubleshooting |
| Competitive | 12-15 | 45 min | 10-12 | N/A | Strategy planning |
| Agency (Client-Friendly) | 12-15 | 40 min | 12-15 | 200 | Non-technical stakeholders |

## Decision Tree

```
User asks for report →
├─ "weekly report" → Weekly (references/templates.md § Weekly)
├─ "monthly report" → Monthly (references/templates.md § Monthly)
├─ "quarterly" or "full audit" → Quarterly (references/templates.md § Quarterly)
├─ "technical audit" → Technical (references/templates.md § Technical)
├─ "competitor" → Competitive (references/templates.md § Competitive)
└─ "client report" or "agency" → Agency (references/templates.md § Agency)
```

## Quick Start: Weekly Report (10 min)

### 1. Collect Data (5 calls)

```javascript
const ga4 = await callTool("ga4_overview", {
  property_id: "PROPERTY_ID:domain.com",
  start_date: "7daysAgo", end_date: "today"
});
const gscDaily = await callTool("gsc_performance", {
  site_url: "domain.com", start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD", dimensions: ["date"]
});
const gscPrev = await callTool("gsc_performance", {
  site_url: "domain.com", start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD", dimensions: ["date"]
});
const keywords = await callTool("gsc_performance", {
  site_url: "domain.com", start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD", dimensions: ["query"], row_limit: 50
});
const pages = await callTool("gsc_performance", {
  site_url: "domain.com", start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD", dimensions: ["page"], row_limit: 10
});
```

### 2. Calculate Changes

```javascript
// Position change: previous - current (improvement = positive)
const posChange = gscPrev.average_position - gscDaily.average_position;
// Percentage changes
const clicksChange = ((gscDaily.total_clicks - gscPrev.total_clicks) / gscPrev.total_clicks * 100).toFixed(1);
```

### 3. Generate HTML

Use the base design system below, then save as `weekly-report-{domain}-{date}.html`. Tell user: "Open in browser, Cmd+P to save as PDF."

## Base Design System

All reports share this CSS foundation:

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 900px; margin: 40px auto; padding: 20px; color: #1a1a1a;
}
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px;
}
.metric-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 20px; margin: 30px 0;
}
.metric-card {
  background: #f8f9fa; padding: 20px; border-radius: 8px;
  border-left: 4px solid #667eea;
}
.metric-value { font-size: 32px; font-weight: bold; color: #667eea; }
.metric-change.positive { color: #10b981; }
.metric-change.negative { color: #ef4444; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th { background: #667eea; color: white; padding: 12px; text-align: left; }
td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
.highlight {
  background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b;
  margin: 20px 0; border-radius: 4px;
}
.chart-container {
  height: 300px; margin: 30px 0; background: #f8f9fa;
  padding: 20px; border-radius: 8px;
}
```

Include Chart.js via CDN: `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1"></script>`

## Chart.js Quick Reference

```javascript
// Line (traffic trends)
new Chart(ctx, {
  type: 'line',
  data: { labels: dates, datasets: [{
    data: clicks, borderColor: '#667eea', tension: 0.4, fill: true,
    backgroundColor: 'rgba(102, 126, 234, 0.1)'
  }]},
  options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true }}}
});

// Doughnut (traffic sources)
new Chart(ctx, {
  type: 'doughnut',
  data: { labels: ['Organic','Direct','Referral','Social'],
    datasets: [{ data: [org,dir,ref,soc],
      backgroundColor: ['#667eea','#f59e0b','#10b981','#ec4899'] }]
  }
});

// Bar (position distribution)
new Chart(ctx, {
  type: 'bar',
  data: { labels: ['1-3','4-10','11-20','21-50','51+'],
    datasets: [{ data: counts,
      backgroundColor: ['#10b981','#67e8a9','#f59e0b','#f97316','#ef4444'] }]
  }
});
```

## Core Analysis Functions

For data processing functions used across all report types, read:
- **CWV thresholds & color coding**: `references/analysis.md` § Core Web Vitals
- **CTR opportunity analysis**: `references/analysis.md` § CTR Opportunities
- **Cannibalization detection**: `references/analysis.md` § Cannibalization
- **Quick wins identification**: `references/analysis.md` § Quick Wins
- **Recommendation generation**: `references/analysis.md` § Recommendations
- **Position change calculation**: `references/analysis.md` § Position Changes
- **Year-over-year comparison**: `references/analysis.md` § YoY Growth
- **Index coverage analysis**: `references/analysis.md` § Index Coverage

## Full Report Templates

For complete HTML templates with data collection workflows, report structures, and styling:
- **All 6 report type templates**: Read `references/templates.md`
- Includes: full HTML/CSS, Chart.js configs, data collection sequences, agent prompt workflows

## Setup & Tool Reference

For MCP configuration, troubleshooting, pricing tiers, and all 39 tool descriptions:
- **Setup & tools guide**: Read `references/setup.md`

## Pro Tips

1. Always fetch comparison period data — reports without trends are useless
2. Position change = `previous - current` (positive = improvement)
3. Use `row_limit: 50` minimum for keywords (not 10)
4. CWV thresholds: LCP ≤2500ms good, INP ≤200ms good, CLS ≤0.1 good
5. Save as HTML, tell user to open in browser + Cmd+P for PDF
6. For Pro users: `generate_report` tool does data collection automatically
7. Free users: call individual tools in sequence (see setup guide)
