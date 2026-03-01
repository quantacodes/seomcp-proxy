# SEO-MCP User Guide

Complete guide to using SEO-MCP for AI-powered SEO analysis in Claude, Cursor, and other MCP clients.

## When to Use This Skill

Use this skill when users need help with:
- Setting up SEO-MCP for the first time
- Configuring their MCP client
- Understanding available SEO tools
- Troubleshooting connection issues
- Getting the most from SEO-MCP features

## Compatibility

**SEO-MCP Tools work with ANY MCP-compatible client:**
- ✅ Claude Desktop (Mac/Windows)
- ✅ Claude Code (CLI)
- ✅ Cursor IDE
- ✅ VSCode with Continue.dev
- ✅ Any MCP-supporting editor/IDE

**PDF generation methods work with ANY AI agent:**
- The HTML/Playwright/Python methods work regardless of which AI you're using
- Claude, GPT-4, Gemini, local LLMs - all can generate reports
- The skill provides universal PDF generation techniques

## What is SEO-MCP?

SEO-MCP brings 39 powerful SEO tools directly into your AI assistant. Analyze Google Search Console data, track Google Analytics, audit websites, manage sitemaps, and submit URLs for indexing - all through natural conversation.

### How It Works

```
Your AI Assistant (Claude/Cursor)
         ↓
SEO-MCP connects to your Google account
         ↓
Fetches real-time SEO data
         ↓
Provides insights and analysis
```

## Quick Setup Guide

### Step 1: Get Your API Key

1. Visit [seomcp.dev/dashboard](https://seomcp.dev/dashboard)
2. Sign up or sign in
3. Generate a new API key
4. Copy and save it securely

### Step 2: Set Up Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new service account
3. Enable these APIs:
   - Google Search Console API
   - Google Analytics Data API
   - PageSpeed Insights API
4. Download the JSON key file
5. Share your GSC properties with the service account email
6. Add the service account to your GA4 properties

### Step 3: Configure Your MCP Client

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "npx",
      "args": ["-y", "github:quantacodes/seomcp-proxy"],
      "env": {
        "SEOMCP_API_KEY": "sk_live_your_api_key_here",
        "GOOGLE_SERVICE_ACCOUNT": "/absolute/path/to/service-account.json",
        "GA4_PROPERTIES": "123456789:example.com,987654321:blog.com",
        "GSC_PROPERTIES": "example.com,blog.com"
      }
    }
  }
}
```

**For Cursor** (`.cursor/mcp.json` or `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "npx",
      "args": ["-y", "github:quantacodes/seomcp-proxy"],
      "env": {
        "SEOMCP_API_KEY": "sk_live_your_api_key_here",
        "GOOGLE_SERVICE_ACCOUNT": "/absolute/path/to/service-account.json",
        "GA4_PROPERTIES": "123456789:example.com",
        "GSC_PROPERTIES": "example.com"
      }
    }
  }
}
```

**For Claude Code** (`~/.claude/settings.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "seo-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:quantacodes/seomcp-proxy"],
      "env": {
        "SEOMCP_API_KEY": "sk_live_your_api_key_here",
        "GOOGLE_SERVICE_ACCOUNT": "/absolute/path/to/service-account.json",
        "GA4_PROPERTIES": "123456789:example.com",
        "GSC_PROPERTIES": "example.com"
      }
    }
  }
}
```

**For VSCode with Continue.dev** (`~/.continue/config.json`):

```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "npx",
      "args": ["-y", "github:quantacodes/seomcp-proxy"],
      "env": {
        "SEOMCP_API_KEY": "sk_live_your_api_key_here",
        "GOOGLE_SERVICE_ACCOUNT": "/absolute/path/to/service-account.json",
        "GA4_PROPERTIES": "123456789:example.com",
        "GSC_PROPERTIES": "example.com"
      }
    }
  }
}
```

**For Other MCP Clients:**

The setup is similar - add the server configuration to your client's MCP config file. All MCP clients use the same environment variables and command structure.

### Environment Variables Explained

| Variable | Required | Description | Example (Mac/Linux) | Example (Windows) |
|----------|----------|-------------|---------------------|-------------------|
| `SEOMCP_API_KEY` | Yes | Your API key from seomcp.dev | `sk_live_abc123...` | `sk_live_abc123...` |
| `GOOGLE_SERVICE_ACCOUNT` | Yes | Full path to service account JSON | `/Users/you/Downloads/service.json` | `C:\Users\you\Downloads\service.json` |
| `GA4_PROPERTIES` | For GA4 tools | Property IDs with domains (example IDs shown) | `123456789:example.com` | `123456789:example.com` |
| `GSC_PROPERTIES` | For GSC tools | Domain names (we auto-format) | `example.com,blog.com` | `example.com,blog.com` |

**Important Notes:**
- Use **absolute paths** for the service account file
- Property ID format: `propertyID:domain` (comma-separated for multiple)
- **Property IDs shown are examples** - use your actual GA4 property IDs from Google Analytics
- Domain format: Just the domain name, no `sc-domain:` prefix needed

## Common Issues & Solutions

### Issue: "API key has been revoked"

**What it means:** Your API key is no longer valid

**How to fix:**
1. Go to [seomcp.dev/dashboard](https://seomcp.dev/dashboard)
2. Generate a new API key
3. Update your MCP config with the new key
4. Restart your AI assistant (Claude Desktop/Cursor)

### Issue: "Google authentication not configured"

**What it means:** Service account credentials are missing or invalid

**How to fix:**
1. Check that `GOOGLE_SERVICE_ACCOUNT` points to the correct file path
2. Ensure the path is **absolute** (starts with `/` on Mac/Linux or `C:\` on Windows)
3. Verify the JSON file is a valid Google service account
4. Make sure the service account has access to your GSC/GA4 properties

### Issue: Tools not showing up in Claude/Cursor

**What it means:** MCP configuration isn't loaded properly

**How to fix:**
1. Check your config file location:
   - Claude: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Cursor: `~/.cursor/mcp.json` or `.cursor/mcp.json` (project)
2. Verify JSON syntax is valid (no trailing commas, quotes match)
3. Restart Claude Desktop or Cursor completely
4. Check the MCP logs for errors

### Issue: "Property not found" errors

**What it means:** GA4 property ID or GSC domain is incorrect

**How to fix:**
1. For GA4: Get the property ID from Google Analytics (Admin → Property Settings)
2. Format: `propertyID:domain` (e.g., `123456789:example.com`)
3. For GSC: Use just the domain name (e.g., `example.com`, not `sc-domain:example.com`)
4. Verify the service account has access to these properties

### Issue: Rate limit exceeded

**What it means:** You've used all your monthly API calls

**How to fix:**
1. Check your usage at [seomcp.dev/dashboard](https://seomcp.dev/dashboard)
2. Wait until next month for limits to reset
3. Or upgrade your plan for higher limits

### Issue: "Pro tool requires upgrade" (error code -32003)

**What it means:** You're on the Free plan and tried to use a Pro-only tool

**Pro-only tools:** `generate_report`, `gsc_bulk_inspect`, `ga4_batch_report`

**How to fix:**
1. Upgrade to Pro ($29/mo) at [seomcp.dev/dashboard](https://seomcp.dev/dashboard)
2. Or use the manual workflow instead (call individual tools in sequence)

## Pricing & Plans

### Free Plan
- ✅ 50 API calls per month
- ✅ 1 API key
- ✅ 36 tools (atomic tools only)
- ✅ Community support
- ❌ No bundled/convenience tools (generate_report, gsc_bulk_inspect, ga4_batch_report)

### Pro Plan — $29/month
- ✅ 500 API calls per month
- ✅ Up to 5 API keys
- ✅ All 39 tools (including Pro-only bundled tools)
- ✅ `generate_report` — one-command full SEO audit
- ✅ `gsc_bulk_inspect` — inspect multiple URLs at once
- ✅ `ga4_batch_report` — multiple analytics reports in one call

### Enterprise Plan — Contact Us
- ✅ Unlimited API calls
- ✅ Unlimited API keys
- ✅ All 39 tools
- ✅ Custom integrations
- ✅ Dedicated support
- 📧 [Contact sales](https://seomcp.dev) for pricing

**Note:** Only successful API calls count toward your monthly quota. Failed calls and rate-limited responses don't consume your allowance. Usage resets on the 1st of each month.

## Available Tools (39)

### Google Search Console (8 tools)
- `gsc_performance` - Get search performance data (clicks, impressions, CTR, position)
- `gsc_list_sites` - List all verified GSC properties
- `gsc_list_sitemaps` - View submitted sitemaps
- `gsc_submit_sitemap` - Submit a new sitemap
- `gsc_delete_sitemap` - Remove a sitemap
- `gsc_inspect_url` - Inspect URL indexing status, rich results, mobile usability
- `gsc_bulk_inspect` - Inspect multiple URLs at once ⭐ **Pro**
- `gsc_search_appearances` - Rich result type breakdown (FAQ, Event, HowTo, etc.)

### Google Indexing API (4 tools)
- `google_indexing_submit_url` - Submit single URL to Google for immediate indexing
- `google_indexing_batch_submit` - Submit multiple URLs (max 100 per batch)
- `google_indexing_submit_sitemap` - Fetch sitemap and submit all URLs
- `google_indexing_submit_file` - Submit URLs from a file

### Google Analytics 4 (13 tools)
- `ga4_list_properties` - List all GA4 properties accessible to service account
- `validate_properties` - Validate GA4 property configuration
- `ga4_report` - Custom analytics reports (5 presets + full custom mode)
- `ga4_batch_report` - Multiple reports in one call ⭐ **Pro**
- `ga4_funnel_report` - Conversion funnel analysis
- `ga4_realtime` - Live active users right now
- `ga4_metadata` - Discover available dimensions and metrics
- `ga4_overview` - Quick dashboard of key metrics
- `ga4_top_pages` - Most visited pages
- `ga4_traffic_sources` - Where traffic comes from
- `ga4_devices` - Traffic by device type, browser, OS
- `ga4_geography` - Traffic by country/city

### Site Auditing (3 tools)
- `site_audit` - Comprehensive site crawl and analysis
- `crawl_page` - Deep-crawl and analyze a single page
- `test_robots_txt` - Test if URLs are allowed/blocked by robots.txt

### Core Web Vitals (1 tool)
- `core_web_vitals` - PageSpeed Insights (LCP, INP, CLS, FCP, TTFB, performance score)

### Schema & Structured Data (2 tools)
- `validate_schema` - Validate JSON-LD structured data
- `analyze_robots_txt` - Parse and analyze robots.txt rules

### Sitemaps (1 tool)
- `sitemap_index_diff` - Compare sitemap URLs vs GSC indexed URLs

### IndexNow (4 tools)
- `indexnow_submit_url` - Submit single URL for instant indexing
- `indexnow_batch_submit` - Submit multiple URLs
- `indexnow_submit_sitemap` - Submit entire sitemap
- `indexnow_submit_file` - Submit URLs from file

### Reports (1 tool)
- `generate_report` - One-command full SEO report with 16 sections and health score ⭐ **Pro**

### System (2 tools)
- `quota_status` - Check API quota usage
- `healthcheck` - Verify service is working
- `version` - Check SEO-MCP version

## Building Comprehensive Reports (Manual Flow)

The `generate_report` tool is Pro-only. Free users can build equivalent reports by calling individual tools in sequence:

### Step 1: Google Search Console Data (30-60 seconds)
```
# Get overall performance (last 30 days)
gsc_performance(
  site_url: "example.com",
  dimensions: ["date"],
  start_date: "2026-02-01",
  end_date: "2026-02-28"
)

# Get top queries
gsc_performance(
  site_url: "example.com",
  dimensions: ["query"],
  start_date: "2026-02-01",
  end_date: "2026-02-28",
  row_limit: 25
)

# Get top pages
gsc_performance(
  site_url: "example.com",
  dimensions: ["page"],
  start_date: "2026-02-01",
  end_date: "2026-02-28",
  row_limit: 25
)

# Get device breakdown
gsc_performance(
  site_url: "example.com",
  dimensions: ["device"],
  start_date: "2026-02-01",
  end_date: "2026-02-28"
)
```

### Step 2: Google Analytics 4 Data (20-40 seconds)
```
# Get traffic overview
ga4_overview(
  property_id: "123456789",
  start_date: "30daysAgo",
  end_date: "today"
)

# Get traffic sources
ga4_traffic_sources(
  property_id: "123456789",
  start_date: "30daysAgo",
  end_date: "today"
)

# Get top pages
ga4_top_pages(
  property_id: "123456789",
  start_date: "30daysAgo",
  end_date: "today",
  limit: 25
)

# Get device breakdown
ga4_devices(
  property_id: "123456789",
  start_date: "30daysAgo",
  end_date: "today"
)
```

### Step 3: Technical SEO (10-30 seconds)
```
# Validate structured data
validate_schema(url: "https://example.com")

# Check robots.txt
analyze_robots_txt(site_url: "https://example.com")

# Get Core Web Vitals
core_web_vitals(
  url: "https://example.com",
  strategy: "mobile"
)
```

### Step 4: Site Audit (Optional - 1-3 minutes)
```
# Only run if you need detailed crawl data
# This is the slowest operation
site_audit(
  start_url: "https://example.com",
  max_pages: 20  # Keep it low to avoid timeouts
)
```

### Step 5: Compile the Report
After collecting all data:
1. Organize metrics by category (Performance, Traffic, Technical)
2. Calculate period-over-period changes
3. Identify top wins and issues
4. Create action items with priority
5. Format as HTML/Markdown/PDF

**Total Time**: 2-5 minutes depending on site size and included sections.

**Pro Tip**: Skip site_audit and core_web_vitals if you need quick reports. GSC + GA4 data alone provides 80% of value.

## Best Practices

### Configuration
1. **Use absolute paths** for the service account file
2. **Name your MCP server `seo-mcp`** for consistency
3. **Keep your API key secure** - never commit it to version control
4. **Use environment variables** for sensitive data when possible

### Google Service Account
1. **One service account per project** is usually enough
2. **Share GSC properties** with the service account email (Viewer role)
3. **Add to GA4 properties** with Viewer permissions
4. **Enable all required APIs** in Google Cloud Console
5. **Download and store the JSON key securely**

### Usage Management
1. **Monitor your usage** regularly at seomcp.dev/dashboard
2. **Set up multiple API keys** for different projects (Pro/Enterprise)
3. **Rotate keys periodically** for security
4. **Upgrade your plan** before hitting limits

### Getting Help
- **Documentation**: [seomcp.dev/docs](https://seomcp.dev/docs)
- **Dashboard**: [seomcp.dev/dashboard](https://seomcp.dev/dashboard)
- **Support**: Contact through the dashboard
- **Status**: Check service status at seomcp.dev

## Troubleshooting Common Errors

### GA4 Metric Name Errors

Google Analytics 4 metric names are strict. Common mistakes:

**❌ Wrong Metric Names:**
- `averageEngagementTime` → ✅ Use `userEngagementDuration`
- `pageViews` → ✅ Use `screenPageViews`
- `users` → ✅ Use `totalUsers` or `activeUsers`
- `sessionDuration` → ✅ Use `averageSessionDuration`

**How to Find Correct Names:**
```
# Use ga4_metadata to discover all valid metrics
ga4_metadata(
  property_id: "123456789",
  category: "metric"  # or "dimension"
)
```

**Common Valid Metrics:**
- `sessions` - Total sessions
- `totalUsers` - Total users
- `screenPageViews` - Page/screen views
- `averageSessionDuration` - Avg session time (seconds)
- `bounceRate` - Bounce rate (0-1 decimal)
- `engagementRate` - Engagement rate (0-1 decimal)
- `userEngagementDuration` - Total engagement time (seconds)
- `conversions` - Total conversions
- `eventCount` - Total events

**Common Valid Dimensions:**
- `sessionDefaultChannelGroup` - Traffic source categories
- `deviceCategory` - mobile, desktop, tablet
- `pageTitle` - Page title
- `pagePath` - Page URL path
- `country` - User country
- `city` - User city
- `date` - Date (YYYYMMDD format)

### GSC Property Format Errors

Google Search Console requires specific property URL formats:

**✅ Correct Formats:**
- `sc-domain:example.com` - For domain properties (most common)
- `https://example.com/` - For URL-prefix properties
- `https://www.example.com/` - For www URL-prefix properties

**❌ Common Mistakes:**
- `example.com` - Missing `sc-domain:` prefix
- `http://example.com` - Wrong protocol (GSC uses HTTPS)
- `sc-domain:https://example.com` - Don't combine formats

**Pro Tip:** The SEO-MCP tools automatically resolve domain names to `sc-domain:` format if not configured in your sites list.

### Date Format Requirements

Different APIs require different date formats:

**GSC (Google Search Console):**
- Format: `YYYY-MM-DD`
- Example: `2026-02-28`
- ❌ Don't use: `30daysAgo`, relative dates

**GA4 (Google Analytics):**
- Format: Relative dates OR `YYYY-MM-DD`
- Examples: `30daysAgo`, `today`, `yesterday`, `7daysAgo`, `2026-02-28`
- Both formats work

### Timeout Issues

Some operations take longer than 30 seconds and will timeout:

**Operations That May Timeout:**
- `generate_report` - Consider using manual flow for large sites
- `site_audit` with many pages - Reduce `max_pages` to 20 or less
- `core_web_vitals` - PageSpeed API can be slow, be patient

**Solutions:**
- Use manual flow for comprehensive reports (see above)
- Reduce page limits for audits
- Call tools individually instead of batch operations

## Creating Beautiful PDF Reports

SEO-MCP provides all the data you need to generate professional, agency-quality PDF reports. Here's how to create them yourself.

### 📚 Advanced Report Templates

**For AI agents generating reports for users:**

- **Quick Start:** [`quick-report-guide.md`](./quick-report-guide.md) - Fast reference with copy-paste templates
- **Deep Dive:** [`agent-report-templates.md`](./agent-report-templates.md) - Complete workflows and examples

### 📊 Available Report Types

SEO-MCP supports **6 different report types** for different use cases:

#### 1. Weekly Performance Report ⚡
- **Duration:** 10-15 minutes
- **Length:** 2-3 pages
- **Best for:** Regular client updates, internal dashboards
- **Includes:** Week-over-week comparison, top 10 keywords, top 10 pages, quick wins
- **API Calls:** ~5 calls

#### 2. Monthly SEO Summary 📅
- **Duration:** 20-30 minutes
- **Length:** 8-10 pages
- **Best for:** Monthly client reporting, stakeholder updates
- **Includes:** Month-over-month comparison, 50-200 keywords, traffic sources, device performance, CTR opportunities
- **API Calls:** ~10+ calls

#### 3. In-Depth Quarterly Audit 🔬
- **Duration:** 1-2 hours
- **Length:** 15-20 pages
- **Best for:** Strategy planning, major stakeholder presentations
- **Includes:** Quarter/year-over-year comparison, 1000+ keywords, cannibalization detection, full site crawl, competitor benchmarking, search appearances
- **API Calls:** ~25+ calls

#### 4. Competitive Analysis Report 🎯
- **Duration:** 30-45 minutes
- **Length:** 10-12 pages
- **Best for:** Strategy planning, identifying content gaps
- **Includes:** Keyword overlap, ranking comparison, content gap analysis, backlink gap, feature comparison
- **API Calls:** ~12-15 calls

#### 5. Technical SEO Health Check ⚙️
- **Duration:** 15-20 minutes
- **Length:** 5-7 pages
- **Best for:** Pre-launch audits, troubleshooting technical issues
- **Includes:** Core Web Vitals (mobile + desktop), full site crawl, indexing status, schema validation, robots.txt analysis, internal linking
- **API Calls:** ~8+ calls

#### 6. Client-Friendly Agency Report 🎨
- **Duration:** 30-40 minutes
- **Length:** 12-15 pages
- **Best for:** Agency client reporting, non-technical stakeholders
- **Includes:** Executive summary (storytelling), performance snapshot, key highlights, critical issues (plain language), content performance by type, search visibility, technical health (simplified), monthly activities, action plan
- **API Calls:** ~12-15 calls
- **Special Features:** Narrative-driven, minimal jargon, clear action items with expected impact

### 🎯 Which Report Should I Generate?

**Choose based on your goal:**
- Need a quick check-in? → **Weekly Performance Report**
- Monthly status update? → **Monthly SEO Summary**
- Planning next quarter? → **Quarterly Audit**
- Comparing to competitors? → **Competitive Analysis**
- Debugging technical issues? → **Technical Health Check**
- Presenting to clients/stakeholders? → **Client-Friendly Agency Report**

**Each template includes:**
- ✅ Exact API calls to make (with parameters)
- ✅ HTML/Chart.js templates ready to use
- ✅ Data processing and calculation examples
- ✅ Agent prompt workflows
- ✅ Python automation scripts

### Why Generate PDFs Yourself?

- **Full Control**: Customize layout, branding, and design
- **No Dependencies**: Don't rely on external services
- **Cost Effective**: Generate unlimited reports
- **Client-Ready**: Professional deliverables for agencies

### Report Generation Workflow

```
1. Collect Data → Use SEO-MCP tools to gather metrics
2. Structure Data → Organize into report sections
3. Create Visualizations → Generate charts and graphs
4. Format Content → Apply professional styling
5. Export to PDF → Convert to downloadable file
```

### Method 0: Browser Print-to-PDF (Simplest)

**Best for:** Zero dependencies, works for everyone

```
1. Ask your AI assistant to generate a styled HTML report
2. Save the HTML file (File → Save As)
3. Open in your browser (Chrome, Firefox, Safari)
4. Press Ctrl+P (or Cmd+P on Mac)
5. Select "Save as PDF"
6. Done!
```

**Pros:** No libraries needed, works everywhere, perfect for charts
**Cons:** Manual step, not automated

### Method 1: HTML to PDF with Playwright (Best for Charts)

**Best for:** Beautiful designs, Chart.js integration, automation

**⚠️ Important:** Chart.js requires JavaScript execution. Use Playwright (not wkhtmltopdf) for chart rendering.

```python
from playwright.sync_api import sync_playwright

def create_html_pdf(html_content, output_path):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content, wait_until="networkidle")
        page.pdf(
            path=output_path,
            format='A4',
            margin={
                'top': '15mm',
                'right': '15mm',
                'bottom': '15mm',
                'left': '15mm'
            }
        )
        browser.close()
```

### Method 2: Using AI Assistant Directly

**Best for:** When working with AI assistants (Claude, etc.)

**Natural Language Workflow:**

1. **Ask your AI assistant:** "Collect my SEO data for example.com using SEO-MCP tools"
2. **AI calls the tools:** ga4_overview, gsc_performance, core_web_vitals, etc.
3. **Ask:** "Format this data as a beautiful HTML report with charts"
4. **AI generates:** Professional HTML with styling and Chart.js visualizations
5. **Ask:** "Save this as report.html"
6. **Finally:** Open in browser and print to PDF (Ctrl+P → Save as PDF)

This is the most accessible approach - no coding required!

### Tools & Libraries

**Recommended for PDF generation:**

| Library | Language | Best For | Chart.js Support | Difficulty |
|---------|----------|----------|------------------|------------|
| Playwright | Node/Python | Modern HTML/JS | ✅ Yes | Medium |
| ReportLab | Python | Programmatic control | ❌ No | Medium |
| weasyprint | Python | HTML/CSS to PDF | ❌ No | Easy |
| PDFKit | Node.js | Simple PDFs | ❌ No | Easy |

**⚠️ For Chart.js visualizations:** Use Playwright or browser print-to-PDF. Other tools cannot render JavaScript charts.

## Example Queries

Once configured, you can ask your AI assistant:

- "What's my current SEO performance for example.com?"
- "Show me top keywords driving traffic this month"
- "Audit my website and list all issues"
- "Submit my new blog post URL for indexing"
- "What are my Core Web Vitals scores?"
- "Compare traffic between this month and last month"
- "Show me which pages have the highest bounce rate"
- "Generate a comprehensive SEO report" (Pro)
- **"Create a beautiful PDF report for my client using SEO-MCP data"**

## Security & Privacy

- ✅ Your Google credentials are **never stored** on our servers
- ✅ Service account JSON is sent securely over HTTPS
- ✅ API keys are hashed and encrypted
- ✅ All data transmissions use TLS encryption
- ✅ You control access via API key management
- ✅ Revoke keys instantly from the dashboard
- ✅ Only successful calls count toward your quota

## Updates & Changelog

Stay updated with new features and improvements at [seomcp.dev/docs](https://seomcp.dev/docs)
