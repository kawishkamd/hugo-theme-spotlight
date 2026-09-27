# Baremetal — Hugo Portfolio Theme

A minimalist, high-performance personal portfolio theme engineered for systems administrators, DevOps engineers, and backend developers.

Zero external runtime dependencies. Zero npm packages. 100% Google Lighthouse scores. Sub-80ms build times.

![Baremetal Screenshot](images/screenshot.png)

---

## ✨ Features

- **⚡ Blazing Fast Build Times:** Native Hugo Pipes compilation with zero external build tools (no Node, npm, Tailwind, or Webpack required).
- **🌓 Instant Zero-FOUC Dark/Light Mode:** Pure CSS/JS theme switcher synchronized with user system preferences (`prefers-color-scheme`) and persistent `localStorage`.
- **📊 Interactive GitHub Activity Heatmap:** Clean, lightweight SVG contribution calendar generated automatically via the included Python utility script.
- **♿ WCAG 2.4.1 / 2.4.7 Accessible:** Built-in "Skip to content" link and visible `:focus-visible` focus rings for keyboard navigation.
- **📱 100% Responsive Design:** Seamlessly adapts from 320px mobile screens to ultrawide desktop viewports.
- **🧩 Modular Section Toggles:** Turn sections (Projects, Experience, Certifications, Heatmap, Writing, Contact) on or off directly from your `hugo.yaml`.
- **🔍 SEO & Social Ready:** Automatic OpenGraph meta tags, Twitter card summaries, and Schema.org JSON-LD structured data.

---

## 🚀 Quick Start

### 1. Create a New Hugo Site
```bash
hugo new site my-portfolio
cd my-portfolio
git init
```

### 2. Install the Theme
Add Baremetal as a Git submodule:
```bash
git submodule add https://github.com/kawishkamd/hugo-theme-baremetal.git themes/baremetal
```

### 3. Copy Example Site Data
Get started immediately by copying the demo content:
```bash
cp -r themes/baremetal/exampleSite/* .
```

### 4. Run the Development Server
```bash
hugo server -D
```
Open your browser to `http://localhost:1313/` to view your site!

---

## ⚙️ Configuration (`hugo.yaml`)

Baremetal is 100% "variable-ready". Customize everything inside your `hugo.yaml` without touching HTML:

```yaml
baseURL: 'https://example.com/'
locale: 'en-us'
title: 'Baremetal Portfolio'
theme: 'baremetal'

params:
  # Identity & Header
  author: "Alex Morgan"
  brand_text: "AM"
  role: "Systems & Infrastructure Engineer"
  hero_description: "Automating systems and building reliable infrastructure from bare metal to cloud."
  site_description: "A minimalist portfolio theme engineered for DevOps developers."
  avatar: "/img/avatar.webp"      # Stored in static/img/
  site_image: "/img/share.jpg"     # OpenGraph share preview
  verified_badge: true             # Show verified badge next to name

  # Social Profiles (Omit any to hide icon)
  github: "https://github.com/example"
  linkedin: "https://linkedin.com/in/example"
  linkedin_name: "Alex Morgan"
  youtube: "https://youtube.com/@example"
  x: "https://x.com/example"
  email: "alex@example.com"
  medium: "https://medium.com/@example"

  # Section Toggles (Set to false to hide)
  sections:
    projects: true
    experience: true
    credentials: true
    github_activity: true
    writing: true
    contact: true

  # Contact & Sticky Note Annotation
  contact_heading: "Let's work together."
  contact_annotation: true
  contact_note: "contact is right here - say hello :)"

  # Footer
  footer_quote: "Code with precision. Ship with confidence."

# Navigation Menu
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

## 📊 Generating Your GitHub Heatmap

Baremetal includes a zero-dependency Python script to scrape your live GitHub contribution graph and output the exact JSON structure:

```bash
python themes/baremetal/tools/fetch_contributions.py <your-github-username> data/github_contributions.json
```

You can automate this in your CI/CD pipeline (e.g. GitHub Actions) to refresh your heatmap weekly or on every deployment!

---

## 📁 Managing Content & Data

All projects, work history, and credentials live in structured data files inside `data/`:

- **`data/portfolio.json`**: Holds `projects`, `experience`, and `credentials`.
- **`data/articles.json`**: Holds technical articles or blog post summaries.
- **`data/github_contributions.json`**: Holds the contribution matrix.

---

## 🚢 Deployment

### GitHub Pages (Recommended)
Add `.github/workflows/deploy.yml`:
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

---

## 📄 License

Distributed under the [MIT License](LICENSE).
Built with precision by [Kawishka Dahanayaka](https://kawishkamd.github.io).
