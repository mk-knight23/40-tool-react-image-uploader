# Playground/Experimental Design System

**Theme Identity:** Fun, bold, and experimental UI with playful interactions

## Color Palette

### Primary Gradients
```css
--play-gradient-1: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); /* Purple to Pink */
--play-gradient-2: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); /* Yellow to Red */
--play-gradient-3: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); /* Cyan to Purple */
```

### Solid Colors
```css
--play-purple: #a855f7;
--play-pink: #ec4899;
--play-yellow: #f59e0b;
--play-cyan: #06b6d4;
```

### Background & Surface
```css
--play-bg: #0f0f1a;           /* Deep purple-black */
--play-surface: #1a1a2e;      /* Lighter purple-black */
--play-surface-hover: #252542;
```

### Text Colors
```css
--play-text-primary: #ffffff;
--play-text-secondary: #a1a1aa;
--play-text-muted: #71717a;
```

## Typography

### Font Families
```css
--font-display: 'Space Grotesk', sans-serif;  /* Bold headings */
--font-body: 'Outfit', sans-serif;           /* Playful body text */
```

### Type Scale
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-4xl: 2.25rem;    /* 36px */
--text-6xl: 3.75rem;    /* 60px */
```

## Border Radius

```css
--radius-sm: 0.75rem;    /* 12px */
--radius-md: 1rem;       /* 16px */
--radius-lg: 1.5rem;     /* 24px */
--radius-xl: 2rem;       /* 32px */
--radius-2xl: 2.5rem;    /* 40px */
--radius-full: 9999px;
```

## Component Patterns

### Playful Buttons
```css
.btn-play {
  background: var(--play-gradient-1);
  border-radius: var(--radius-xl);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-play:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 24px rgba(168, 85, 247, 0.4);
}
```

### Bounce Cards
```css
.bounce-card {
  background: var(--play-surface);
  border-radius: var(--radius-xl);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bounce-card:hover {
  transform: translateY(-8px) rotate(1deg);
  background: var(--play-surface-hover);
}
```

### Gradient Borders
```css
.gradient-border {
  position: relative;
  background: var(--play-surface);
  border-radius: var(--radius-xl);
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--play-gradient-1);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.gradient-border:hover::before {
  opacity: 1;
}
```

## Animation Presets

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-wiggle:hover {
  animation: wiggle 0.3s ease-in-out;
}
```

## Interactive Effects

### Hover Glow
```css
.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.5),
              0 0 60px rgba(236, 72, 153, 0.3);
}
```

### Morphing Background
```css
.morph-bg {
  background:
    radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(6, 182, 212, 0.2) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: morph-bg 15s ease infinite;
}

@keyframes morph-bg {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## Design Tokens Summary

| Token | Value |
|-------|-------|
| Background | #0f0f1a |
| Surface | #1a1a2e |
| Primary Gradient | Purple → Pink |
| Secondary Gradient | Yellow → Red |
| Border Radius | 16-32px |
| Font Family | Space Grotesk, Outfit |
