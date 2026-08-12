# AURELLE — Fine Stone Jewellery

**Live:** [View Project](./index.html)  
**Role:** Frontend Development & UI Design  
**Stack:** HTML5, CSS3 (Custom Properties, Grid), Vanilla JavaScript (ES6+)

## The Project
A concept website for **Aurelle**, a fictional high jewellery maison in Lyon specializing in ornamental stones (malachite, lapis lazuli, fire opal). The goal was to build a digital experience that feels as weighty and considered as the physical pieces — slow, deliberate, and rich in detail.

## Technical Highlights

### 1. Zero-Dependency Architecture
The entire site is built with **Vanilla JavaScript** and **Custom CSS**. There are no frameworks (React/Vue) and no utility libraries (jQuery/Tailwind). This was a deliberate choice to demonstrate mastery of the core web platform:
*   **CSS Grid & Flexbox** for complex, responsive layouts.
*   **CSS Custom Properties** for a centralized design token system (colors, spacing, easing).
*   **IntersectionObserver** for performant scroll-triggered animations (no scroll-jacking libraries).

### 2. Performance & Accessibility
*   **Preloader:** A custom-built asset loader that ensures the hero image is ready before the reveal animation starts.
*   **Reduced Motion:** Fully respects `prefers-reduced-motion`. If a user has this setting enabled, all parallax, marquee, and reveal animations are instantly disabled, and the content is presented statically.
*   **Keyboard Navigation:** The stone tabs and lightbox are fully navigable via keyboard (Arrow keys, Enter, Escape).
*   **Semantic HTML:** Proper use of `<article>`, `<section>`, `<figure>`, and ARIA labels for screen readers.

### 3. Interactive Elements
*   **Custom Cursor:** A magnetic ring cursor that scales up on interactive elements (links, buttons, inputs).
*   **Lightbox:** A custom modal for viewing product details, with focus trapping and escape-key support.
*   **Form Validation:** Real-time, client-side validation with custom error states and success messaging.

## Running Locally
Since this is a static site, you can open `index.html` directly in a browser, or use a simple local server:

```bash
npx serve .
