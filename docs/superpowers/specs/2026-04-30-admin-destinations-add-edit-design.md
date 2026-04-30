# Admin destinations add/edit design

## Goal

Add destination creation and editing screens so admins can manage destination category-style content from the admin workspace.

## User experience

- `/admin/destinations` keeps the existing dashboard/listing layout.
- The header **Add destination** action links to `/admin/destinations/new`.
- Each destination card's **Edit copy** action links to `/admin/destinations/[slug]/edit`.
- `/admin/destinations/new` opens a focused add page inside `AdminShell`, with a back action to the destination listing.
- `/admin/destinations/[slug]/edit` opens the same form with resolved mock data for that destination.
- Form submit is mock-only: it validates local fields, shows a saved/review state, and does not persist or publish data.

## Form scope

The form should capture destination data that maps to a destination category page:

- Essentials: title, slug, market or region, price/from price, rating, and commercial status.
- Listing card: card image URL, alt text, and short description.
- Detail/editorial: hero image URL, hero alt text, summary, intro paragraphs, and spotlight bullets.
- Relationships: related tours and related hotels as editable text rows for mock merchandising links.

Required validation:

- title
- price/from price
- rating
- card image URL
- hero image URL
- short description

## Architecture

- Add route files under `frontend/app/admin/destinations/new/page.tsx` and `frontend/app/admin/destinations/[slug]/edit/page.tsx`.
- Add `AdminNewDestinationPage` and `AdminEditDestinationPage` server components under `frontend/src/components/admin/`.
- Add a focused client component `AdminDestinationForm` under `frontend/src/components/admin/` for state, validation, row editing, and mock submit.
- Add `adminDestinationFormData.ts` under `frontend/src/components/admin/` for destination form types, initial create values, slug generation, and resolving edit values from existing mock destination data.
- Update `AdminDestinationsPage` to wire Add destination and Edit copy links.
- Reuse existing local UI components from `src/components/ui/*` and keep `AdminShell` page wrappers server-rendered.

## Data flow

- The add page passes `createDestinationInitialValues` into `AdminDestinationForm`.
- The edit page receives `params.slug`, resolves `ResolvedAdminDestinationEditData`, and passes its initial values into `AdminDestinationForm` with edit-mode copy.
- The form owns local React state for text fields, spotlight rows, related tour rows, related hotel rows, validation errors, and saved state.
- Submit prevents default navigation, validates required fields, and sets the saved state only when valid.

## Accessibility

- Use labelled inputs/selects/textareas.
- Validation messages should be rendered near the related fields and announced through visible text.
- Add/remove row buttons need descriptive labels.
- Back, Add, and Edit navigation should be normal links wrapped by existing `Button asChild` patterns.

## Validation

- Run `npm run lint --prefix frontend`.
- Run `npm run build --prefix frontend`.
- Browser-check `/admin/destinations`, `/admin/destinations/new`, and at least one `/admin/destinations/[slug]/edit` route.
- Confirm Add destination navigates to the new page, Edit copy navigates to the edit page, required field validation appears, a valid submit shows saved state, and the form remains usable at a mobile viewport.
