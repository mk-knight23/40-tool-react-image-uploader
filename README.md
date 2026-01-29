# PixelPlayground - Experimental Image Lab

A fun, bold, and experimental image management platform built with React 18 and Framer Motion. Featuring playful animations, gradient accents, and an edgy modern design that pushes the boundaries of conventional UI.

## Playground/Experimental Theme

This application features a vibrant **"Playground/Experimental"** design system:
- Bold purple-pink-yellow gradient color scheme
- Rounded corners with playful bounce animations
- Interactive hover effects with glow and scale transforms
- Modern, edgy aesthetic with creative flair
- Fun micro-interactions throughout

## Features

| Feature | Description |
|---------|-------------|
| **Bouncy Cards** | Cards that lift and glow on hover with spring animations |
| **Gradient Buttons** | Purple-to-pink gradients with hover scale effects |
| **Animated Upload Zone** | Floating icon with glow effects |
| **Category Pills** | Filter badges with gradient active states |
| **Lightbox Modal** | Full-screen preview with smooth animations |
| **Stats Dashboard** | Animated stat cards with icon indicators |
| **AI Enhancement CTA** | Promotional section with animated background |

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Animations:** Framer Motion
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 with custom design system
- **Icons:** Lucide React

## Design System

See `design-system/MASTER.md` for complete design token documentation.

### Color Palette
```css
--play-purple: #a855f7;      /* Primary purple */
--play-pink: #ec4899;        /* Accent pink */
--play-yellow: #f59e0b;       /* Highlight yellow */
--play-cyan: #06b6d4;         /* Secondary cyan */
```

### Gradients
```css
/* Primary Gradient */
linear-gradient(135deg, #a855f7 0%, #ec4899 100%)

/* Secondary Gradient */
linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)
```

### Key Components
- `.bounce-card` - Cards with spring hover animation
- `.btn-play-primary` - Gradient button with scale effect
- `.category-pill` - Filter badge with active gradient state
- `.upload-zone` - Dashed border zone with glow hover
- `.stat-card` - Stat display with icon

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.tsx           # Main application with gallery
├── main.tsx          # Entry point
├── index.css         # Design system styles
└── firebase/         # Firebase configuration
```

## Deployment

This project is configured for deployment on three platforms:

### GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Trigger**: Push to `main` branch
- **Action**: `actions/deploy-page@v4` with Vite static site generator

### Vercel
- **Config**: `vercel.json`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: SPA fallback to `/index.html`

### Netlify
- **Config**: `netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: All paths to `/index.html` (SPA support)

---

## Live Links

| Platform | URL |
|----------|-----|
| **GitHub Pages** | https://mk-knight23.github.io/40-tool-react-image-uploader/ |
| **Vercel** | https://40-tool-react-image-uploader.vercel.app/ |
| **Netlify** | https://40-tool-react-image-uploader.netlify.app/ |

---

**Theme:** Playground/Experimental
**License:** MIT
**Author:** mk-knight23
