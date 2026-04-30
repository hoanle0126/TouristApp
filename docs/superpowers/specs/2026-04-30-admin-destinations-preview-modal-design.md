# Admin destinations preview modal design

## Goal

Add an in-page preview modal for destination cards in the admin destination workspace.

## User experience

- `/admin/destinations` keeps the current dashboard/listing layout.
- Each destination card's **Preview** action opens a centered modal overlay on the same page.
- The modal shows enough destination category content for admins to review the listing and detail-page story without leaving the admin workspace.
- The modal includes **Edit copy**, linking to `/admin/destinations/[slug]/edit`, and **Close** actions.
- The modal closes through the Close button, Escape key, or backdrop click.

## Preview content

The modal should show data from existing mock destination detail data:

- Destination hero/card image.
- Title, market/region, price, rating, and commercial signal.
- Listing description and detail summary.
- Spotlight bullets.
- Related tours and related hotels.

## Architecture

- Add a focused client component `AdminDestinationCatalogPreview` under `frontend/src/components/admin/`.
- Move the existing destination catalog card rendering from `AdminDestinationsPage` into this client component.
- Keep `AdminDestinationsPage` server-rendered and pass `destinationCards` into `AdminDestinationCatalogPreview`.
- Use `destinationDetails` and `slugifyDestinationTitle` to resolve richer preview data for the selected card.
- Reuse existing local UI components and `next/image`.
- Do not add a new route and do not persist any data.

## Accessibility

- Use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby` on the modal.
- Move focus into the modal on open and restore previous focus on close.
- Trap Tab/Shift+Tab within the modal while open.
- Close on Escape.
- Lock background scroll while the modal is open.
- Keep the backdrop non-focusable.
- Provide a descriptive close button label.

## Validation

- Run `npm run lint --prefix frontend`.
- Run `npm run build --prefix frontend`.
- Browser-check `/admin/destinations`.
- Confirm Preview opens the modal for at least one destination.
- Confirm Close, Escape, and backdrop click close the modal.
- Confirm **Edit copy** navigates to `/admin/destinations/[slug]/edit`.
- Confirm the modal remains usable at a mobile viewport.
