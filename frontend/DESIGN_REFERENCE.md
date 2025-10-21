# Visual Design Reference

## 🎨 Color Palette

### Primary Gradients
```
Emerald to Teal:    #10b981 → #14b8a6
Amber to Orange:    #f59e0b → #f97316
Purple to Pink:     #a855f7 → #ec4899
Cyan to Teal:       #06b6d4 → #14b8a6
```

### Background Colors
```
Light Mode:
- Base:       #f8fafc (slate-50)
- Secondary:  #ecfdf5 (emerald-50)
- Accent:     #fffbeb (amber-50)

Dark Mode:
- Base:       #0f172a (slate-900)
- Secondary:  #1e293b (slate-800)
- Accent:     #0f766e (emerald-700)
```

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Navigation Bar (Fixed)                         │
│  Logo | WareFlow          [Sign In Button]      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  HERO SECTION                                   │
│  ┌──────────────┐  ┌──────────────┐            │
│  │              │  │   Dashboard  │            │
│  │  Headlines   │  │   Preview    │            │
│  │  + CTAs      │  │   (Animated) │            │
│  │              │  │              │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  STATS SECTION                                  │
│  [10K+]  [500+]  [1M+]  [99.9%]                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FEATURES SECTION                               │
│  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │ F1  │ │ F2  │ │ F3  │                       │
│  └─────┘ └─────┘ └─────┘                       │
│  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │ F4  │ │ F5  │ │ F6  │                       │
│  └─────┘ └─────┘ └─────┘                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  CTA SECTION (Gradient Background)              │
│  "Ready to Transform Your Warehouse?"           │
│  [Start Free Trial]  [Schedule Demo]            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FOOTER                                         │
│  Product | Company | Social Links               │
└─────────────────────────────────────────────────┘
```

## 🎭 Component Variations

### Buttons

**Primary Button (Emerald)**
```tsx
className="bg-gradient-to-r from-emerald-500 to-teal-600 
           hover:from-emerald-600 hover:to-teal-700
           text-white rounded-xl shadow-lg
           hover:shadow-emerald-500/50
           transform hover:scale-105
           transition-all duration-200"
```

**Secondary Button (Outline)**
```tsx
className="bg-white dark:bg-slate-800
           border-2 border-slate-200 dark:border-slate-700
           hover:border-emerald-500
           text-slate-900 dark:text-white
           rounded-xl transform hover:scale-105
           transition-all duration-200"
```

### Cards

**Feature Card**
```tsx
className="group bg-gradient-to-br from-white to-slate-50
           dark:from-slate-800 dark:to-slate-900
           rounded-2xl p-8
           border border-slate-200 dark:border-slate-700
           hover:border-transparent
           hover:shadow-xl hover:-translate-y-1
           transition-all duration-300"
```

**Stat Card**
```tsx
className="bg-white dark:bg-slate-800
           rounded-2xl p-6
           border border-slate-200 dark:border-slate-700
           hover:shadow-xl transform hover:-translate-y-1
           transition-all duration-300"
```

## 📱 Responsive Breakpoints

```tsx
// Mobile First Approach
<div className="
  text-2xl              /* Mobile (default) */
  sm:text-3xl           /* Tablet (640px+) */
  lg:text-4xl           /* Desktop (1024px+) */
">

<div className="
  grid-cols-1          /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet: 2 columns */
  lg:grid-cols-3       /* Desktop: 3 columns */
">
```

## 🎬 Animations

### Fade In (Page Load)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Hover Effects
- **Scale**: `hover:scale-105` (5% increase)
- **Translate**: `hover:-translate-y-1` (lift effect)
- **Shadow**: `hover:shadow-xl` (depth)
- **Gradient Shift**: Color transition on hover

### Loading States
```tsx
<div className="animate-pulse">
  {/* Skeleton content */}
</div>
```

## 🌗 Dark Mode Classes

```tsx
// Background
className="bg-white dark:bg-slate-900"

// Text
className="text-slate-900 dark:text-white"

// Border
className="border-slate-200 dark:border-slate-700"

// Gradient (Auto adjusts)
className="bg-gradient-to-r 
           from-emerald-600 to-teal-600
           dark:from-emerald-400 dark:to-teal-400"
```

## 🔧 Utility Classes

### Custom Gradients
```tsx
// Text Gradient
className="bg-gradient-to-r from-emerald-600 to-teal-600
           bg-clip-text text-transparent"

// Background Gradient
className="bg-gradient-to-br from-emerald-500 to-teal-600"
```

### Backdrop Blur (Glassmorphism)
```tsx
className="bg-white/80 backdrop-blur-md"
```

### Shadow with Color
```tsx
className="shadow-xl hover:shadow-emerald-500/50"
```

## 📊 Icon System

Using **Lucide React** for consistent, lightweight icons:

```tsx
import { Package, Mail, Lock, Eye, EyeOff, 
         ArrowLeft, Users, Box, BarChart } from 'lucide-react';

<Package className="w-6 h-6 text-emerald-500" />
```

## 🎯 Spacing System

Following Tailwind's spacing scale (4px base unit):

```
p-4  = 16px    (small padding)
p-6  = 24px    (medium padding)
p-8  = 32px    (large padding)
p-12 = 48px    (extra large padding)

gap-4  = 16px  (grid/flex gap)
gap-8  = 32px  (section spacing)
```

## 🚦 Status Colors

```tsx
// Success
className="text-emerald-600 bg-emerald-50"

// Warning
className="text-amber-600 bg-amber-50"

// Error
className="text-rose-600 bg-rose-50"

// Info
className="text-cyan-600 bg-cyan-50"
```

---

**Color Philosophy**: The emerald/teal palette represents:
- 🌱 Growth and efficiency
- 📦 Logistics and movement
- ✅ Reliability and success
- 🔄 Sustainability

**Design Philosophy**: Modern, professional, and warehouse-industry appropriate while standing out from typical corporate blue designs.
