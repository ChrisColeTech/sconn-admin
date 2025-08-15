# 🎨 SConnect Admin Design System & Style Guide

**Version**: 1.0  
**Status**: Active - Reference for all implementation  
**Last Updated**: August 14, 2025

This style guide defines the visual language, interaction patterns, and implementation standards for the SConnect Admin application. **All development must reference and follow these guidelines.**

---

## 🌈 Color Palette

### **Primary Colors**
```css
/* Purple Spectrum - Primary Brand */
--purple-50: #faf5ff;
--purple-100: #f3e8ff;
--purple-200: #e9d5ff;
--purple-300: #d8b4fe;
--purple-400: #c084fc;
--purple-500: #a855f7;  /* Primary */
--purple-600: #9333ea;  /* Primary Dark */
--purple-700: #7c3aed;
--purple-800: #6b21a8;
--purple-900: #581c87;

/* Pink Spectrum - Secondary Brand */
--pink-50: #fdf2f8;
--pink-100: #fce7f3;
--pink-200: #fbcfe8;
--pink-300: #f9a8d4;
--pink-400: #f472b6;
--pink-500: #ec4899;    /* Secondary */
--pink-600: #db2777;    /* Secondary Dark */
--pink-700: #be185d;
--pink-800: #9d174d;
--pink-900: #831843;
```

### **Neutral Colors**
```css
/* Dark Theme Base */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;    /* Background Dark */

/* White Variants */
--white: #ffffff;
--white-90: rgba(255, 255, 255, 0.9);
--white-80: rgba(255, 255, 255, 0.8);
--white-70: rgba(255, 255, 255, 0.7);
--white-60: rgba(255, 255, 255, 0.6);
--white-50: rgba(255, 255, 255, 0.5);
--white-40: rgba(255, 255, 255, 0.4);
--white-30: rgba(255, 255, 255, 0.3);
--white-20: rgba(255, 255, 255, 0.2);
--white-10: rgba(255, 255, 255, 0.1);
--white-05: rgba(255, 255, 255, 0.05);
```

### **Semantic Colors**
```css
/* Success */
--success-400: #4ade80;
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning */
--warning-400: #facc15;
--warning-500: #eab308;
--warning-600: #ca8a04;

/* Error */
--error-400: #f87171;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-400: #60a5fa;
--info-500: #3b82f6;
--info-600: #2563eb;
```

---

## 🎭 Background & Surface Treatments

### **Primary Backgrounds**
```css
/* Main Application Background */
.bg-app-primary {
  background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
}

/* Authentication Background */
.bg-auth-primary {
  background: linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #0f172a 100%);
}

/* Dashboard Background */
.bg-dashboard {
  background: #f8fafc;
}
```

### **Glassmorphism Effects**
```css
/* Primary Glass Surface */
.glass-primary {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Secondary Glass Surface */
.glass-secondary {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Interactive Glass Surface */
.glass-interactive {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-interactive:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(147, 51, 234, 0.15);
}
```

### **Gradient Treatments**
```css
/* Primary Brand Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}

/* Hover Brand Gradient */
.gradient-primary-hover {
  background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
}

/* Subtle Accent Gradient */
.gradient-accent {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

/* Success Gradient */
.gradient-success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

/* Error Gradient */
.gradient-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}
```

---

## 📝 Typography

### **Font Stack**
```css
/* Primary Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Monospace Font Family */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
```

### **Type Scale**
```css
/* Display Typography */
.text-display-xl { font-size: 4.5rem; line-height: 1; font-weight: 800; }    /* 72px */
.text-display-lg { font-size: 3.75rem; line-height: 1; font-weight: 800; }   /* 60px */
.text-display-md { font-size: 3rem; line-height: 1.1; font-weight: 700; }    /* 48px */
.text-display-sm { font-size: 2.25rem; line-height: 1.2; font-weight: 700; } /* 36px */

/* Heading Typography */
.text-h1 { font-size: 2rem; line-height: 1.25; font-weight: 700; }      /* 32px */
.text-h2 { font-size: 1.75rem; line-height: 1.3; font-weight: 600; }    /* 28px */
.text-h3 { font-size: 1.5rem; line-height: 1.35; font-weight: 600; }    /* 24px */
.text-h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }    /* 20px */
.text-h5 { font-size: 1.125rem; line-height: 1.45; font-weight: 500; }  /* 18px */
.text-h6 { font-size: 1rem; line-height: 1.5; font-weight: 500; }       /* 16px */

/* Body Typography */
.text-body-xl { font-size: 1.125rem; line-height: 1.7; font-weight: 400; }  /* 18px */
.text-body-lg { font-size: 1rem; line-height: 1.6; font-weight: 400; }      /* 16px */
.text-body-md { font-size: 0.875rem; line-height: 1.5; font-weight: 400; }  /* 14px */
.text-body-sm { font-size: 0.75rem; line-height: 1.4; font-weight: 400; }   /* 12px */

/* Label Typography */
.text-label-lg { font-size: 0.875rem; line-height: 1.4; font-weight: 500; } /* 14px */
.text-label-md { font-size: 0.75rem; line-height: 1.3; font-weight: 500; }  /* 12px */
.text-label-sm { font-size: 0.6875rem; line-height: 1.2; font-weight: 500; } /* 11px */
```

### **Text Colors**
```css
/* Primary Text */
.text-primary { color: rgba(255, 255, 255, 0.95); }
.text-secondary { color: rgba(255, 255, 255, 0.8); }
.text-tertiary { color: rgba(255, 255, 255, 0.6); }
.text-quaternary { color: rgba(255, 255, 255, 0.4); }

/* Brand Text */
.text-brand { color: #a855f7; }
.text-brand-secondary { color: #ec4899; }

/* On Light Backgrounds */
.text-dark-primary { color: rgba(15, 23, 42, 0.95); }
.text-dark-secondary { color: rgba(15, 23, 42, 0.8); }
.text-dark-tertiary { color: rgba(15, 23, 42, 0.6); }
```

---

## 🧩 Component Specifications

### **Form Elements**

#### **Input Fields**
```css
.input-primary {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-primary:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2), 0 0 20px rgba(168, 85, 247, 0.1);
  transform: scale(1.02);
}

.input-primary::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
```

#### **Buttons**
```css
/* Primary Button */
.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(168, 85, 247, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Ghost Button */
.btn-ghost {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
}
```

#### **Cards & Containers**
```css
.card-primary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-primary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.card-interactive {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-interactive:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 48px rgba(168, 85, 247, 0.15);
}
```

---

## ✨ Animation Standards

### **Timing Functions**
```css
/* Standard Easing */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);

/* Spring Easing */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Custom Easing */
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-dramatic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### **Duration Standards**
```css
/* Micro Interactions */
--duration-fast: 0.15s;
--duration-normal: 0.3s;
--duration-slow: 0.5s;

/* Page Transitions */
--duration-page: 0.8s;
--duration-modal: 0.4s;

/* Loading States */
--duration-spin: 1s;
--duration-pulse: 2s;
```

### **Animation Patterns**

#### **Entrance Animations**
```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

#### **Interactive Animations**
```css
/* Hover Lift */
.hover-lift {
  transition: transform 0.3s var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Hover Glow */
.hover-glow {
  transition: all 0.3s var(--ease-out);
}
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

/* Button Press */
.btn-press {
  transition: transform 0.1s var(--ease-out);
}
.btn-press:active {
  transform: scale(0.98);
}
```

#### **Loading Animations**
```css
/* Spinning Loader */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 🎯 Interaction Patterns

### **Hover States**
- **Lift Effect**: 2-4px translateY with subtle shadow
- **Scale Effect**: 1.02-1.05 scale for small elements
- **Glow Effect**: Colored shadow matching brand colors
- **Color Transitions**: 300ms ease-out for color changes

### **Focus States**
- **Outline**: 2px solid brand color with 20% opacity outer glow
- **Scale**: Subtle 1.02 scale for form elements
- **Color**: Brand color accents on labels and borders

### **Active States**
- **Scale Down**: 0.95-0.98 scale for immediate feedback
- **Shadow Reduction**: Flatten shadow during press
- **Quick Duration**: 100-150ms for responsiveness

### **Loading States**
- **Opacity**: Reduce to 50-70% during loading
- **Disable Interactions**: pointer-events: none
- **Spinner**: Consistent 1s rotation with smooth easing
- **Progress**: Linear progress with pulse animation

---

## 📏 Spacing & Layout

### **Spacing Scale**
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### **Border Radius**
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 32px;
--radius-full: 9999px;
```

### **Shadows**
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Colored Shadows */
--shadow-brand: 0 10px 25px rgba(168, 85, 247, 0.3);
--shadow-success: 0 10px 25px rgba(34, 197, 94, 0.3);
--shadow-error: 0 10px 25px rgba(239, 68, 68, 0.3);
```

---

## 🎪 Special Effects

### **Floating Orbs**
```javascript
// Standard floating orb configuration
const floatingOrbs = [
  { size: 120, color: 'from-purple-500/30 to-pink-500/30', duration: 20 },
  { size: 80, color: 'from-blue-500/20 to-cyan-500/20', duration: 25 },
  { size: 100, color: 'from-indigo-500/25 to-purple-500/25', duration: 30 },
  { size: 60, color: 'from-pink-500/20 to-rose-500/20', duration: 35 },
];

// Animation pattern
const orbAnimation = {
  x: [0, 30, -30, 0],
  y: [0, -30, 30, 0],
  scale: [1, 1.1, 0.9, 1],
};
```

### **Mouse Following Effects**
```css
.mouse-follow {
  position: absolute;
  width: 384px;
  height: 384px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(64px);
  pointer-events: none;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Shimmer Effects**
```css
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: skewX(-20deg);
  animation: shimmer 2s infinite;
  animation-delay: 3s;
}
```

---

## 📱 Responsive Design

### **Breakpoints**
```css
/* Mobile First Approach */
--mobile: 0px;        /* 0px and up */
--tablet: 768px;      /* 768px and up */
--desktop: 1024px;    /* 1024px and up */
--wide: 1280px;       /* 1280px and up */
--ultra: 1536px;      /* 1536px and up */
```

### **Component Adaptations**
- **Mobile**: Full-width cards, collapsed navigation, touch-optimized buttons (44px minimum)
- **Tablet**: Grid layouts, sidebars become drawers, optimized for touch and mouse
- **Desktop**: Full layout with sidebars, hover states active, keyboard navigation
- **Wide**: Larger containers, more whitespace, enhanced animations

---

## ⚡ Performance Guidelines

### **Animation Performance**
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left` (triggers layout)
- Use `will-change` sparingly and remove after animation
- Prefer CSS transitions over JavaScript animations for simple effects

### **Glassmorphism Performance**
- Limit backdrop-filter blur to 20px maximum
- Use backdrop-filter only on elements that need it
- Consider reducing blur on mobile devices
- Group glassmorphic elements to minimize redraws

### **Image & Asset Optimization**
- Use WebP format with fallbacks
- Implement lazy loading for non-critical images
- Optimize SVG icons and remove unnecessary paths
- Use CSS gradients instead of gradient images

---

## 🎛️ Implementation Guidelines

### **Required CSS Custom Properties**
All components must define and use CSS custom properties for:
- Colors (including alpha variants)
- Spacing values
- Animation durations and easing
- Border radius values
- Shadow definitions

### **Component Structure**
```typescript
// Standard component pattern
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  children 
}) => {
  return (
    <motion.div
      className={cn(
        'base-styles',
        variants[variant],
        sizes[size],
        disabled && 'disabled-styles',
        loading && 'loading-styles'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
```

### **Animation Implementation**
```typescript
// Standard animation variants
const standardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.95 },
  hover: { y: -4, scale: 1.02 },
  tap: { scale: 0.98 }
};

// Use consistent timing
const standardTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
};
```

---

## 🏗️ Usage in Implementation Plan

**Reference this guide for:**
1. **Color Selection**: Use defined color tokens, never arbitrary colors
2. **Component Design**: Follow glassmorphism and animation patterns
3. **Interaction Design**: Implement standard hover, focus, and active states
4. **Animation Implementation**: Use defined timing and easing functions
5. **Responsive Behavior**: Follow mobile-first breakpoint strategy
6. **Performance Optimization**: Apply performance guidelines for all effects

**All new components must:**
- Follow the defined color palette and glassmorphism effects
- Implement standard animation patterns with Framer Motion
- Include proper hover, focus, and loading states
- Be fully responsive using defined breakpoints
- Meet performance guidelines for animations and effects

This style guide ensures **visual consistency**, **interaction excellence**, and **performance optimization** across the entire SConnect Admin application.

---

**Next Reference**: [Implementation Plan](../development/IMPLEMENTATION_PLAN.md) - Apply this style guide to all objectives