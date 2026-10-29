# Improvement Roadmap

This roadmap is staged so a student can improve the project without trying to fix everything at once.

## Phase 1: Correctness Fixes

Goal: make the existing app behavior more reliable.

Recommended tasks:

1. Fix `payCart()` to use `authUserId`.
2. Protect the `/cart` route or intentionally implement guest cart behavior.
3. Replace logout storage behavior with `localStorage.removeItem("id")`.
4. Guard localStorage parsing with a safe helper.
5. Check `response.ok` in every API request.
6. Do not clear local cart state unless checkout succeeds.

Why this phase comes first:

- These are behavior bugs, not style preferences.
- Fixing them improves user trust.
- Later refactoring is safer when current behavior is correct.

## Phase 2: API And State Refactor

Goal: separate responsibilities.

Recommended tasks:

1. Create `src/api/`.
2. Move endpoint calls into API modules:
   - `authApi.js`
   - `productsApi.js`
   - `cartApi.js`
3. Create one shared request helper for JSON requests.
4. Keep Redux slices focused on state transitions.
5. Decide if product search belongs in Redux or component state.

Why this matters:

- API logic becomes reusable.
- Reducers become easier to test.
- Errors become consistent.

Suggested target:

```text
Component
   |
   v
Redux thunk
   |
   v
API module
   |
   v
requestJson helper
   |
   v
fetch
```

## Phase 3: Responsive Design Pass

Goal: make the app work on phone, tablet, and desktop.

Recommended tasks:

1. Replace fixed product grid columns with `auto-fit` or breakpoints.
2. Replace product detail fixed height with content-driven layout.
3. Use `min-height` instead of large fixed heights.
4. Rebuild cart rows with CSS Grid.
5. Remove invalid CSS values.
6. Remove global `overflow-x: hidden` after layout fixes.

Why this matters:

- Ecommerce-style pages are commonly used on mobile.
- Responsive design catches many hidden layout mistakes.
- Good layout teaches better CSS fundamentals.

## Phase 4: Form And Accessibility Improvements

Goal: make the app easier to use for more people.

Recommended tasks:

1. Add labels to inputs.
2. Support `type`, `name`, `id`, and `autoComplete` in `Input.jsx`.
3. Use password input types.
4. Add `aria-label` or visible text for icon buttons.
5. Ensure focus states are visible.
6. Make error messages specific and close to the related input.

Why this matters:

- Accessibility is not an advanced extra; it is part of correct HTML.
- Good forms are easier for everyone, not only screen reader users.

## Phase 5: Testing

Goal: prevent regressions.

Recommended tasks:

1. Add Vitest.
2. Test reducers:
   - login success,
   - logout,
   - add product to cart,
   - remove product from cart,
   - clear cart.
3. Test utility helpers:
   - safe localStorage parsing,
   - request helper errors.
4. Add React Testing Library tests:
   - login form disables submit when empty,
   - route guard redirects unauthenticated users.
5. Add one Playwright end-to-end test:
   - login,
   - search product,
   - add product to cart,
   - clear cart.

Why this matters:

- Tests make refactoring less scary.
- Bugs like the `userId` mismatch are easy to catch automatically.

## Phase 6: Documentation And Naming Cleanup

Goal: make the project easier to understand for future readers.

Recommended tasks:

1. Replace the starter README with a project-specific README.
2. Document environment variables.
3. Document main user flows.
4. Rename unclear files gradually.
5. Keep Portuguese or English naming consistent.

Suggested README sections:

- Project overview.
- Features.
- Tech stack.
- Environment variables.
- How to run locally.
- Main folders.
- Known limitations.
- Future improvements.

## Priority Table

| Priority | Area | Reason |
| --- | --- | --- |
| High | Cart checkout bug | Can call invalid API route |
| High | Cart route protection | Auth model is inconsistent |
| High | localStorage safety | Can crash app on startup |
| High | API response checks | Avoid false success states |
| Medium | Responsive layout | Better real-device experience |
| Medium | Form semantics | Better accessibility and UX |
| Medium | API module separation | Easier testing and maintenance |
| Low | Naming cleanup | Improves readability over time |

