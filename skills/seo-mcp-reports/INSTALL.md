# Installing the SEO Report Skill

Load this skill into your AI agent so it automatically generates professional, agency-quality SEO reports with charts, styled tables, and visual dashboards.

---

## Claude Code (CLI)

### Option 1: Project-level (recommended)

Add to your project's `.mcp.json` or create a `CLAUDE.md` that references the skill:

```bash
# Clone into your project
git clone https://github.com/quantacodes/seomcp-proxy.git /tmp/seomcp-proxy
cp -r /tmp/seomcp-proxy/skills/seo-mcp-reports ./skills/
```

Then add to your project's `CLAUDE.md`:

```markdown
## Skills

When generating SEO reports, read the skill at `skills/seo-mcp-reports/SKILL.md` and follow its instructions.
For full HTML templates, read `skills/seo-mcp-reports/references/templates.md`.
For data analysis functions, read `skills/seo-mcp-reports/references/analysis.md`.
```

### Option 2: Global (all projects)

Add to `~/.claude/CLAUDE.md`:

```markdown
## SEO Reports

When asked to generate SEO reports, read the skill files from:
- Quick start: ~/skills/seo-mcp-reports/SKILL.md
- Templates: ~/skills/seo-mcp-reports/references/templates.md
- Analysis: ~/skills/seo-mcp-reports/references/analysis.md
- Setup: ~/skills/seo-mcp-reports/references/setup.md
```

```bash
# Copy skill to home directory
mkdir -p ~/skills
cp -r /path/to/seomcp-proxy/skills/seo-mcp-reports ~/skills/
```

---

## Claude Desktop

Claude Desktop supports project knowledge via the **Project** feature.

### Step 1: Create a Project

1. Open Claude Desktop
2. Click **"Projects"** in the sidebar → **"New Project"**
3. Name it "SEO Reports" (or add to an existing project)

### Step 2: Add Skill Files as Project Knowledge

1. Click **"Add content"** → **"Add text content"**
2. Copy and paste the contents of `SKILL.md` — this is the main instruction file
3. Add another knowledge entry with the contents of `references/analysis.md` — the data processing functions
4. *(Optional)* Add `references/templates.md` for full HTML templates (large file — 124KB. Add only if you need the complete templates in context)

### Step 3: Add Custom Instructions

In the project's **Custom Instructions** field, add:

```
When I ask for an SEO report, follow the seo-mcp-reports skill instructions.
Use the base design system from SKILL.md for styling. Reference the analysis
functions for data processing. Generate reports as HTML files with Chart.js.
```

### Step 4: Use It

Start a conversation in the project and ask:

- "Generate a weekly SEO report for example.com"
- "Create a monthly client report"
- "Run a technical SEO audit"

> **Tip:** Claude Desktop also supports MCP prompts. If the SEO-MCP proxy is configured with prompts capability, you'll see report workflows in the prompt picker (`/` menu).

---

## Cursor IDE

### Option 1: Project Rules (recommended)

Create `.cursor/rules/seo-reports.md` in your project:

```markdown
# SEO Report Generation

When generating SEO reports, follow these instructions:

1. Read the skill guide at `skills/seo-mcp-reports/SKILL.md`
2. Use the base design system (CSS, Chart.js) from the skill
3. For data processing, reference `skills/seo-mcp-reports/references/analysis.md`
4. For full HTML templates, reference `skills/seo-mcp-reports/references/templates.md`
5. Save reports as HTML files — user opens in browser and prints to PDF
```

Then copy the skill files:

```bash
mkdir -p skills
cp -r /path/to/seomcp-proxy/skills/seo-mcp-reports ./skills/
```

### Option 2: Global Rules

Add to `~/.cursor/rules/seo-reports.md` with the same content as above, referencing a global skill location.

### Option 3: .cursorrules File

Add to your project's `.cursorrules`:

```
When asked to generate SEO reports, read skills/seo-mcp-reports/SKILL.md first.
Follow its design system for HTML/CSS/Chart.js report generation.
Reference skills/seo-mcp-reports/references/analysis.md for data processing functions.
Reference skills/seo-mcp-reports/references/templates.md for complete report templates.
```

---

## VSCode + Continue.dev

### Step 1: Add to `.continuerules`

Create `.continuerules` in your project root:

```
When generating SEO reports, follow the skill at skills/seo-mcp-reports/SKILL.md.
Use its CSS design system and Chart.js configurations for styled output.
```

### Step 2: Copy Skill Files

```bash
mkdir -p skills
cp -r /path/to/seomcp-proxy/skills/seo-mcp-reports ./skills/
```

### Step 3: Context Providers (Optional)

Add to `.continue/config.json` to make skill files available as context:

```json
{
  "contextProviders": [
    {
      "name": "file",
      "params": {
        "files": [
          "skills/seo-mcp-reports/SKILL.md",
          "skills/seo-mcp-reports/references/analysis.md"
        ]
      }
    }
  ]
}
```

---

## OpenClaw

### Step 1: Drop Into Workspace

```bash
# Copy to your OpenClaw workspace skills directory
cp -r /path/to/seomcp-proxy/skills/seo-mcp-reports ~/clawd/skills/
```

### Step 2: Verify

```bash
openclaw skills list | grep seo-mcp
```

Should show:

```
✓ ready  │ 📦 seo-mcp-reports │ Generate professional, visually stunning SEO reports...
```

### Step 3: Use It

The skill auto-triggers when you ask for SEO reports. Just say:

- "Generate a weekly SEO report for example.com"
- "Create an agency report for my client"

OpenClaw reads `SKILL.md` automatically and loads reference files on demand.

---

## Windsurf / Other MCP Clients

### General Pattern

1. **Copy the skill folder** into your project
2. **Reference SKILL.md** in your agent's system prompt or project config
3. **The agent reads** SKILL.md (175 lines) first, then loads reference files as needed

```bash
# Universal setup
git clone https://github.com/quantacodes/seomcp-proxy.git /tmp/seomcp-proxy
cp -r /tmp/seomcp-proxy/skills/seo-mcp-reports ./skills/
```

Then tell your agent:

```
For SEO report generation, follow the instructions in skills/seo-mcp-reports/SKILL.md
```

---

## File Reference

| File | Size | Purpose | When to Load |
|------|------|---------|--------------|
| `SKILL.md` | 7KB | Quick start, design system, decision tree | **Always** — main entry point |
| `references/analysis.md` | 11KB | CWV, CTR, cannibalization, quick wins functions | When processing data for reports |
| `references/templates.md` | 124KB | Full HTML/CSS/Chart.js templates for 6 report types | When generating a specific report type |
| `references/setup.md` | 24KB | MCP setup, all 39 tools, pricing, troubleshooting | When setting up or debugging SEO-MCP |

### Context Budget Tips

- **Minimal setup:** Load only `SKILL.md` (7KB, ~1,700 tokens) — has the base design system and decision tree
- **Standard setup:** Load `SKILL.md` + `analysis.md` (18KB, ~4,500 tokens) — adds all data processing functions
- **Full setup:** Load everything (166KB, ~40,000 tokens) — complete templates. Only needed if you want exact HTML templates

Most agents work great with just `SKILL.md` — it has the CSS, Chart.js patterns, and enough guidance to generate beautiful reports without loading the full templates.

---

## Verify It Works

After setup, test with:

```
Generate a weekly SEO report for example.com
```

The agent should:
1. ✅ Call 5 SEO-MCP tools (ga4_overview, gsc_performance × 3, gsc by page)
2. ✅ Calculate week-over-week changes
3. ✅ Generate styled HTML with gradient header, metric cards, Chart.js line chart, keyword table
4. ✅ Save as `weekly-report-example.com-YYYY-MM-DD.html`
5. ✅ Tell you to open in browser and Cmd+P to save as PDF

If the output is unstyled markdown instead of HTML — the skill isn't loaded. Check your config.
