# Data Analysis Functions

Reusable JavaScript functions for processing SEO-MCP tool output into report-ready data.

## Table of Contents

1. [Core Web Vitals](#core-web-vitals)
2. [CTR Opportunities](#ctr-opportunities)
3. [Cannibalization Detection](#cannibalization-detection)
4. [Quick Wins](#quick-wins)
5. [Position Changes](#position-changes)
6. [YoY Growth](#yoy-growth)
7. [Index Coverage](#index-coverage)
8. [Recommendation Generation](#recommendation-generation)

---

## Core Web Vitals

Official CWV thresholds with color coding for reports.

```javascript
const cwvThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },  // ms
  inp: { good: 200, needsImprovement: 500 },     // ms
  cls: { good: 0.1, needsImprovement: 0.25 }
};

function evaluateCWV(metric, value) {
  const threshold = cwvThresholds[metric];
  if (value <= threshold.good) {
    return { status: 'good', color: '#10b981', label: 'Good', bgColor: '#d1fae5' };
  } else if (value <= threshold.needsImprovement) {
    return { status: 'needs-improvement', color: '#f59e0b', label: 'Needs Improvement', bgColor: '#fef3c7' };
  } else {
    return { status: 'poor', color: '#ef4444', label: 'Poor', bgColor: '#fee2e2' };
  }
}

function analyzeCWV(cwvResults) {
  return cwvResults.map(result => {
    const lcp = result.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
    const inp = result.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile;
    const cls = result.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile / 100;
    return {
      url: result.url,
      lcp: { value: lcp, ...evaluateCWV('lcp', lcp) },
      inp: { value: inp, ...evaluateCWV('inp', inp) },
      cls: { value: cls, ...evaluateCWV('cls', cls) },
      overallScore: (lcp <= 2500 && inp <= 200 && cls <= 0.1) ? 'passing' : 'failing'
    };
  });
}
```

---

## CTR Opportunities

Expected CTR by position (industry benchmarks) and missed-clicks analysis.

```javascript
const expectedCTRByPosition = {
  1: 0.398, 2: 0.184, 3: 0.106, 4: 0.069, 5: 0.050,
  6: 0.037, 7: 0.029, 8: 0.023, 9: 0.019, 10: 0.016
};

function analyzeCTROpportunities(keywords) {
  return keywords
    .filter(kw => kw.position <= 10)
    .map(kw => {
      const pos = Math.round(kw.position);
      const expectedCTR = expectedCTRByPosition[pos] || 0.01;
      const expectedClicks = kw.impressions * expectedCTR;
      const missedClicks = Math.max(0, expectedClicks - kw.clicks);
      const opportunity = expectedClicks > 0 ? missedClicks / expectedClicks : 0;
      return {
        query: kw.query, position: kw.position,
        impressions: kw.impressions, clicks: kw.clicks,
        actualCTR: (kw.ctr * 100).toFixed(1) + '%',
        expectedCTR: (expectedCTR * 100).toFixed(1) + '%',
        missedClicks: Math.round(missedClicks),
        opportunityScore: (opportunity * 100).toFixed(1),
        recommendation: opportunity > 0.3 ? 'High priority: Optimize title/description'
          : opportunity > 0.15 ? 'Medium priority: Test new title' : 'CTR is healthy'
      };
    })
    .filter(kw => kw.missedClicks > 10)
    .sort((a, b) => b.missedClicks - a.missedClicks)
    .slice(0, 20);
}
```

---

## Cannibalization Detection

Detect when the same keyword ranks for multiple pages.

```javascript
function detectCannibalization(keywordPageMapping) {
  const grouped = {};
  keywordPageMapping.rows.forEach(row => {
    const query = row.keys[0], page = row.keys[1];
    if (!grouped[query]) grouped[query] = [];
    grouped[query].push({ page, clicks: row.clicks, impressions: row.impressions,
      position: row.position, ctr: row.ctr });
  });

  const issues = [];
  Object.entries(grouped).forEach(([query, pages]) => {
    if (pages.length > 1 && pages[0].clicks > 5) {
      const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
      const avgPosition = pages.reduce((sum, p) => sum + p.position, 0) / pages.length;
      issues.push({
        query, pageCount: pages.length,
        pages: pages.sort((a, b) => b.clicks - a.clicks),
        totalClicks, avgPosition: avgPosition.toFixed(1),
        severity: pages.length > 3 ? 'high' : 'medium',
        recommendation: `Consolidate content or use canonical. Primary: ${pages[0].page}`
      });
    }
  });
  return issues.sort((a, b) => b.totalClicks - a.totalClicks).slice(0, 30);
}
```

---

## Quick Wins

Keywords in positions 11-20 (page 2) — easiest to push to page 1.

```javascript
function identifyQuickWins(keywords) {
  return keywords
    .filter(kw => kw.position > 10 && kw.position <= 20 && kw.impressions > 50)
    .map(kw => {
      const projectedCTR = expectedCTRByPosition[10] || 0.016;
      const projectedClicks = kw.impressions * projectedCTR;
      const potentialGain = Math.round(projectedClicks - kw.clicks);
      return {
        query: kw.query, currentPosition: kw.position.toFixed(1),
        positionsToMove: (kw.position - 10).toFixed(1),
        impressions: kw.impressions, currentClicks: kw.clicks,
        projectedClicks: Math.round(projectedClicks), potentialGain,
        priority: potentialGain > 50 ? 'high' : potentialGain > 20 ? 'medium' : 'low'
      };
    })
    .filter(kw => kw.potentialGain > 5)
    .sort((a, b) => b.potentialGain - a.potentialGain)
    .slice(0, 20);
}
```

---

## Position Changes

Correct calculation: `previous - current` so improvement shows as positive.

```javascript
function calculatePositionChange(currentPeriod, previousPeriod) {
  const changes = [];
  currentPeriod.forEach(current => {
    const previous = previousPeriod.find(p => p.query === current.query);
    if (previous) {
      // previous - current: 15→12 = +3 (improvement), 5→8 = -3 (decline)
      const positionChange = previous.position - current.position;
      changes.push({
        query: current.query,
        currentPosition: current.position, previousPosition: previous.position,
        positionChange,
        changeDirection: positionChange > 0 ? 'improved' : positionChange < 0 ? 'declined' : 'unchanged',
        clicks: current.clicks, clicksChange: current.clicks - previous.clicks
      });
    }
  });
  return changes.sort((a, b) => b.positionChange - a.positionChange);
}
```

---

## YoY Growth

Year-over-year comparison for quarterly reports.

```javascript
function calculateYoYGrowth(currentQuarter, previousYear) {
  const currentTotal = currentQuarter.rows.reduce((sum, row) => sum + row.clicks, 0);
  const previousTotal = previousYear.rows.reduce((sum, row) => sum + row.clicks, 0);
  const growth = ((currentTotal - previousTotal) / previousTotal) * 100;
  return {
    currentClicks: currentTotal, previousYearClicks: previousTotal,
    growth: growth.toFixed(1),
    growthDirection: growth > 0 ? 'up' : 'down',
    growthColor: growth > 0 ? '#10b981' : '#ef4444'
  };
}
```

---

## Index Coverage

Sitemap pages vs indexed pages ratio.

```javascript
function analyzeIndexCoverage(sitemaps, inspectionResults) {
  const sitemapPageCount = sitemaps.reduce((sum, s) => sum + (s.contents?.submitted || 0), 0);
  const indexedCount = inspectionResults.filter(r =>
    r.inspectionResult?.indexStatusResult?.verdict === 'PASS').length;
  const coverageRatio = sitemapPageCount > 0 ? (indexedCount / sitemapPageCount) * 100 : 0;

  const issuesByType = {};
  inspectionResults.forEach(r => {
    const state = r.inspectionResult?.indexStatusResult?.coverageState;
    if (state && state !== 'Submitted and indexed')
      issuesByType[state] = (issuesByType[state] || 0) + 1;
  });

  return {
    sitemapPages: sitemapPageCount, indexedPages: indexedCount,
    notIndexedPages: sitemapPageCount - indexedCount,
    coverageRatio: coverageRatio.toFixed(1),
    status: coverageRatio > 90 ? 'good' : coverageRatio > 70 ? 'needs-improvement' : 'poor',
    statusColor: coverageRatio > 90 ? '#10b981' : coverageRatio > 70 ? '#f59e0b' : '#ef4444',
    issuesByType: Object.entries(issuesByType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count, percentage: ((count / sitemapPageCount) * 100).toFixed(1) }))
  };
}
```

---

## Recommendation Generation

Generates prioritized action items from all collected data.

```javascript
function generateRecommendations(data) {
  const recommendations = [];

  // Quick Wins
  const quickWins = identifyQuickWins(data.keywords);
  if (quickWins.length > 0) {
    recommendations.push({
      category: 'Quick Wins', priority: 'High',
      title: `Optimize ${quickWins.length} keywords in positions 11-20`,
      impact: 'High', effort: 'Medium',
      potentialClicks: quickWins.reduce((sum, kw) => sum + kw.potentialGain, 0),
      action: 'Improve on-page SEO: internal links, content depth, title optimization',
      timeline: '2-4 weeks'
    });
  }

  // CTR Opportunities
  const ctrOpps = analyzeCTROpportunities(data.keywords);
  if (ctrOpps.length > 0) {
    recommendations.push({
      category: 'CTR Optimization', priority: 'High',
      title: `Improve CTR for ${ctrOpps.length} underperforming keywords`,
      impact: 'High', effort: 'Low',
      potentialClicks: ctrOpps.reduce((sum, kw) => sum + kw.missedClicks, 0),
      action: 'Rewrite titles and meta descriptions with power words',
      timeline: '1-2 weeks'
    });
  }

  // Technical Issues
  if (data.audit?.missing_h1_count > 0) {
    recommendations.push({
      category: 'Technical SEO', priority: 'High',
      title: `Add H1 tags to ${data.audit.missing_h1_count} pages`,
      impact: 'Medium', effort: 'Low',
      action: 'Add descriptive, keyword-rich H1 tags', timeline: '1 week'
    });
  }

  // CWV Failures
  const cwvAnalysis = analyzeCWV(data.cwvResults || []);
  const failingPages = cwvAnalysis.filter(p => p.overallScore === 'failing');
  if (failingPages.length > 0) {
    recommendations.push({
      category: 'Performance', priority: 'High',
      title: `Fix Core Web Vitals on ${failingPages.length} pages`,
      impact: 'Medium', effort: 'High',
      action: 'Optimize images (WebP), reduce JS, fix layout shifts', timeline: '4-6 weeks'
    });
  }

  // Cannibalization
  const cannibal = detectCannibalization(data.keywordPageMapping || { rows: [] });
  if (cannibal.length > 0) {
    recommendations.push({
      category: 'Content Strategy', priority: 'Medium',
      title: `Resolve cannibalization for ${cannibal.length} keywords`,
      impact: 'Medium', effort: 'Medium',
      action: 'Consolidate content or use canonical tags', timeline: '3-4 weeks'
    });
  }

  return recommendations.sort((a, b) => {
    const p = { High: 0, Medium: 1, Low: 2 };
    return (p[a.priority] - p[b.priority]) || (p[a.impact] - p[b.impact]);
  });
}
```
