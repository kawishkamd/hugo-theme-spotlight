# Hugo Spotlight Theme — User & Developer Guide

Welcome to the official documentation for **Spotlight**, a high-performance, spotlight-driven personal portfolio theme engineered for software engineers, backend architects, and full-stack developers.

---

## 📑 Table of Contents

1. [Features & Design Goals](#1-features--design-goals)
2. [Quickstart Guide](#2-quickstart-guide)
3. [Architecture & How It Works](#3-architecture--how-it-works)
4. [Site Configuration Reference (`hugo.yaml`)](#4-site-configuration-reference-hugoyaml)
5. [Portfolio Data Reference (`data/portfolio.json`)](#5-portfolio-data-reference-dataportfoliojson)
6. [Images & Static Assets](#6-images--static-assets)
7. [GitHub Contribution Heatmap](#7-github-contribution-heatmap)
8. [Customization & Overriding](#8-customization--overriding)
9. [Deployment Playbooks](#9-deployment-playbooks)
10. [Troubleshooting & FAQ](#10-troubleshooting--faq)

---

## 1. Features & Design Goals

- **⚡ Blazing Fast Build Times:** 100% Hugo Pipes native compilation. Average build time is under 50ms.
- **✨ Interactive Cursor Spotlight:** Real-time mouse-tracking radial gradient on cards (`.card-spotlight`) across both dark and light modes.
- **🌓 Instant Zero-FOUC Dark/Light Mode:** Pure CSS/JS theme switcher synchronized with system preferences (`prefers-color-scheme`) and persistent `localStorage`.
- **🚀 Out-of-the-Box Demo Mode:** Works immediately on fresh `hugo new site` installations with built-in fallback data. No blank screens or `<nil>` pointer crashes.
- **📊 Native SVG GitHub Activity Heatmap:** Clean, lightweight contribution calendar generated automatically via the included Python scraper.
- **📱 100% Responsive Design:** Optimized for mobile phones, tablets, laptops, and ultrawide monitors.
- **🧩 Modular Section Toggles:** Turn sections on or off directly from your `hugo.yaml`.
- **🔍 SEO & Social Ready:** Automatic OpenGraph meta tags, Twitter card summaries, and Schema.org JSON-LD structured data.

---

## 2. Quickstart Guide

### Prerequisites
- Hugo version **v0.120.0 or higher** (extended edition recommended).
  Check with: `hugo version`

### Option A: Standard Git Submodule (Recommended)

```bash
# 1. Create your new site
hugo new site my-portfolio
cd my-portfolio
git init

# 2. Add Spotlight as a Git submodule
git submodule add https://github.com/kawishkamd/hugo-theme-spotlight.git themes/hugo-theme-spotlight

# 3. Copy example configuration and demo assets
cp -r themes/hugo-theme-spotlight/exampleSite/* .
rm -f hugo.toml   # Hugo will use the copied hugo.yaml

# 4. Start local development server
hugo server -D
```
Open your browser to `http://localhost:1313/`.

### Option B: Zero-Config Install (Fastest Preview)
Spotlight ships with built-in default data. You can test it immediately without copying `exampleSite/`:

```bash
hugo new site my-portfolio
cd my-portfolio
git submodule add https://github.com/kawishkamd/hugo-theme-spotlight.git themes/hugo-theme-spotlight
echo 'theme = "hugo-theme-spotlight"' >> hugo.toml
hugo server -D
```

---

## 3. Architecture & How It Works

Spotlight organizes your portfolio into **3 distinct layers**:

```
┌────────────────────────────────────────────────────────┐
│ 1. Identity & Switches (hugo.yaml)                     │
│    Name, Role, Hero bio, Social URLs, Section Toggles  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. Structured Content (data/portfolio.json)            │
│    Spotlight Project, 2-Col Projects Grid,             │
│    Work Experience, Certifications, Skill Tags         │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. Static Media (static/img/)                          │
│    avatar.webp, project_*.webp, share.jpg              │
└────────────────────────────────────────────────────────┘
```

### The Cursor Spotlight Glow
All project cards have the `.card-spotlight` CSS class. A tiny vanilla JS event listener tracks mouse movement over the card and sets two CSS custom properties:
- `--mouse-x`: Current cursor X position relative to card.
- `--mouse-y`: Current cursor Y position relative to card.

A CSS pseudo-element (`::before`) uses `radial-gradient(circle at var(--mouse-x) var(--mouse-y), ...)` to create the glowing beam effect under the pointer. On touch devices, this gracefully falls back to a subtle, static border highlight.

---

## 4. Site Configuration Reference (`hugo.yaml`)

Below is the complete parameter reference for your root `hugo.yaml` file:

```yaml
baseURL: 'https://example.com/'       # Public site URL
locale: 'en-us'                       # Language locale
title: 'Alex Rivera | Software Engineer' # Browser title fallback
enableRobotsTXT: true                 # Generates robots.txt
buildFuture: true                     # Render future-dated articles
disableKinds: ["taxonomy", "term"]    # Disables unused Hugo tags/categories
theme: 'hugo-theme-spotlight'          # Name of theme folder in themes/

params:
  # --- Identity & Hero Section ---
  author: "Alex Rivera"               # Your full display name
  brand_text: "AR"                    # Navbar monogram/initials
  role: "Software Engineer"           # Headline under your name
  hero_description: "Building scalable web applications." # Meta description
  hero_bio: "I craft clean code, design robust backend microservices..."
  
  # Highlight tech pills inside hero intro paragraph
  hero_chips:
    - "TypeScript"
    - "Go"
    - "React"
    - "Python"
    - "PostgreSQL"
    - "Docker"

  avatar: "/img/avatar.webp"          # Profile picture in static/img/
  site_image: "/img/share.jpg"        # 1200x630 OpenGraph card preview
  verified_badge: true                # Show verified checkmark next to name

  # --- Social & Contact Profiles (Omit any to hide) ---
  github: "https://github.com/example"
  linkedin: "https://linkedin.com/in/example"
  linkedin_name: "Alex Rivera"        # Label on the LinkedIn card
  x: "https://x.com/example"          # X (Twitter) profile URL
  email: "alex@example.com"           # Direct email address

  # --- Modular Section Switches (true = visible, false = removed) ---
  sections:
    spotlight: true                   # Featured Project showcase card
    projects: true                    # 2-column Projects grid
    experience: true                  # Work history timeline
    tech_stack: true                  # Animated tech marquee ticker
    credentials: true                 # Certifications list
    github_activity: true             # GitHub contribution calendar
    contact: true                     # Quick contact buttons

  # --- Contact Section Copy ---
  contact_heading: "Let's work together."
  contact_bio: "Available for full-stack engineering roles and consulting."

  # --- Footer ---
  footer_quote: "Writing clean code. Shipping reliable systems."

# --- Navigation Menu (Optional) ---
# If omitted, navbar automatically uses smooth in-page anchor links:
# #projects, #experience, #github-activity, #contact
menus:
  main:
    - name: "Projects"
      url: "/projects/"
      weight: 10
    - name: "Experience"
      url: "/experience/"
      weight: 20
    - name: "Certs"
      url: "/certifications/"
      weight: 30
```

---

## 5. Portfolio Data Reference (`data/portfolio.json`)

To override the default projects with your own, create `data/portfolio.json` in your site's root directory:

```json
{
  "spotlight": {
    "category": "FEATURED PROJECT",
    "title": "DevPulse Orchestrator",
    "role": "Lead Systems Architect",
    "description": "High-throughput distributed workflow engine that automates developer environment provisioning.",
    "tags": [
      { "name": "Go" },
      { "name": "TypeScript" },
      { "name": "Redis" }
    ],
    "image": "/img/project_devpulse.webp",
    "link": "https://github.com/example/devpulse",
    "button_text": "View Repository"
  },
  "projects": [
    {
      "title": "EventStream Broker",
      "role": "Open-Source Creator",
      "description": "High-throughput pub/sub event engine with zero-copy binary serialization.",
      "image": "/img/project_eventstream.webp",
      "tags": ["TypeScript", "Node.js", "WebSockets"],
      "link": "https://github.com/example/eventstream"
    }
  ],
  "experience": [
    {
      "title": "Senior Software Engineer",
      "company": "CloudScale Systems",
      "years": "2023 - Present"
    }
  ],
  "credentials": [
    {
      "title": "AWS Certified Solutions Architect",
      "institution": "Amazon Web Services",
      "years": "2024",
      "link": "https://aws.amazon.com/certification/"
    }
  ],
  "tags": [
    {
      "category": "Frontend",
      "items": ["TypeScript", "React", "Next.js"]
    },
    {
      "category": "Backend",
      "items": ["Go", "Python", "PostgreSQL", "Docker"]
    }
  ]
}
```

---

## 6. Images & Static Assets

Place all personal media inside `static/img/` in your site root:

| Asset | Path | Recommended Dimensions | Format |
| :--- | :--- | :--- | :--- |
| **Avatar** | `static/img/avatar.webp` | 160 × 160 px (1:1) | WebP or PNG |
| **Spotlight Card** | `static/img/project_devpulse.webp` | 600 × 340 px (16:9) | WebP |
| **Grid Thumbnails** | `static/img/project_*.webp` | 500 × 280 px (16:9) | WebP |
| **OpenGraph Preview** | `static/img/share.jpg` | 1200 × 630 px | JPG or PNG |
| **Favicon** | `static/favicon.webp` | 32 × 32 px | WebP or PNG |

---

## 7. GitHub Contribution Heatmap
 
The theme automatically renders your live 52-week contribution activity calendar in real time. Simply configure your GitHub profile in `hugo.yaml`:

```yaml
params:
  github: "https://github.com/your-username"
  sections:
    github_activity: true
```

The theme's lightweight JavaScript engine queries your public GitHub activity directly in the browser and caches it in `localStorage` for 4 hours. No external dependencies, Python scripts, or CI/CD cron jobs are required.

---

## 8. Customization & Overriding

Hugo uses a hierarchical lookup order. Any file you place in your site's root directory will cleanly override the theme's corresponding file without modifying the theme submodule.

### Custom CSS
To override theme colors or styles, create `assets/css/custom.css` in your site root and Hugo will bundle it:

```css
:root {
  /* Customize spotlight glow color */
  --spotlight-glow: rgba(59, 130, 246, 0.15);
  
  /* Customize brand accent color */
  --accent: #2563eb;
}
```

### Template Overrides
- To change the footer: Copy `themes/hugo-theme-spotlight/layouts/_default/baseof.html` to `layouts/_default/baseof.html` in your site.
- To customize icon partials: Place your custom SVG inside `layouts/partials/icon/`.

---

## 9. Deployment Playbooks

### GitHub Pages (Recommended)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true
      - run: hugo --minify
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Cloudflare Pages
- **Build command:** `hugo --minify`
- **Build output directory:** `public`
- **Environment variables:**
  - `HUGO_VERSION`: `0.128.0` (or your preferred Hugo version)

### Vercel
- **Framework Preset:** Hugo
- **Build Command:** `hugo --minify`
- **Output Directory:** `public`

---

## 10. Troubleshooting & FAQ

#### Q: My site renders blank when I run `hugo server`.
**Fix:** Verify that `theme: 'hugo-theme-spotlight'` matches the directory name under `themes/` (e.g. `themes/hugo-theme-spotlight`). Also ensure you removed default boilerplate `content/_index.md` files if they contain `draft: true`.

#### Q: The GitHub Heatmap is empty or missing.
**Fix:** Ensure `params.sections.github_activity: true` and `params.github: "https://github.com/your-username"` are set in your `hugo.yaml`.

#### Q: My images show a 404 or broken icon.
**Fix:** In Hugo, static images placed in `static/img/avatar.webp` must be referenced starting with a leading slash: `/img/avatar.webp`, NOT `static/img/avatar.webp`.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built with precision by [Kawishka Dahanayaka](https://kawishkamd.github.io).
