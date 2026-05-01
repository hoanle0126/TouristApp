<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend rules

- Prefer existing components, utilities, hooks, and data structures before creating new ones. Search the codebase first and extend existing abstractions only when they fit the current design.
- Use the local `src/components/ui/*` shadcn-style components for buttons, inputs, selects, cards, labels, and textareas instead of native controls when building page UI.
- Keep Server Components as the default in the Next.js App Router. Add `"use client"` only to the smallest component that needs state, effects, event handlers, browser APIs, or client-only libraries.
- Keep static page content, image URLs, and repeated card/list data in `src/data/*` instead of hardcoding large arrays inside components.
- Use `next/image` for images and update `next.config.ts` remote patterns when new external image hosts are introduced.
- Preserve accessibility: provide meaningful `alt` text, labels for form controls, keyboard-accessible interactions, and descriptive `aria-label` values for icon-only buttons.
- Prefer Tailwind theme classes and existing design tokens over one-off inline styles or arbitrary values. Use arbitrary values only when matching a specific design detail.
- Validate frontend changes with `npm run lint --prefix frontend` and `npm run build --prefix frontend` from the repo root before reporting completion.
- For visible UI changes, run the dev server and verify the page in a browser, including the main responsive state affected by the change.
