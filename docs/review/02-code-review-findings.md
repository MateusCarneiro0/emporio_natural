# Code Review Findings

This file focuses on bugs, maintainability risks, and technical improvements. Findings are ordered by importance.

## 1. Checkout Uses The Wrong Auth Property

Reference: `src/Components/features/cartSlice.js:124` and `src/Components/features/cartSlice.js:127`.

`payCart()` reads:

```js
const { userId } = getState().auth;
```

But the auth state uses `authUserId`, and the other cart thunks correctly map it like this:

```js
const { authUserId: userId } = getState().auth;
```

Why this matters:

- `userId` will be `undefined`.
- The checkout request can become `/users/undefined/clearCart`.
- The UI may clear the cart locally even if the server did not clear it.

Recommended improvement:

- Read the same `authUserId` property used by the other cart functions.
- Only dispatch `cart/payCart` after checking that the API response succeeded.

## 2. `/cart` Is Not Protected But Depends On Authenticated State

Reference: `src/App.jsx:22`, `src/App.jsx:30`, and `src/App.jsx:38`.

`/produtos` and `/produtos/:id` are wrapped in `AuthProtected`, but `/cart` is not. The cart actions expect an authenticated user id from Redux state.

Why this matters:

- A logged-out user can open `/cart` directly.
- The page can show stale cart data from previous state.
- Cart API actions may run without a valid user id.

Recommended improvement:

- Wrap `/cart` with `AuthProtected`, or design a real guest cart.
- Pick one product decision:
  - authenticated cart only, simpler and consistent; or
  - guest cart plus merge-on-login, more complex but user-friendly.

## 3. localStorage Parsing Can Crash The App

Reference: `src/Components/features/localStorageThunk.js:7` and `src/Components/features/authSlice.js:56`.

The app reads:

```js
const id = JSON.parse(localStorage.getItem("id"));
```

Logout writes:

```js
localStorage.setItem("id", "");
```

Why this matters:

- `JSON.parse("")` throws an error.
- A user or browser extension can leave malformed localStorage data.
- A startup crash is harder to understand than a normal failed login state.

Recommended improvement:

- Use `localStorage.removeItem("id")` on logout.
- Wrap parsing in a safe helper.
- Treat invalid storage as "not logged in."

## 4. API Calls Do Not Check HTTP Status

Reference examples:

- `src/Components/features/authSlice.js:98`
- `src/Components/features/authSlice.js:113`
- `src/Components/features/authSlice.js:139`
- `src/Components/features/cartSlice.js:86`
- `src/Components/features/productsSlice.js:57`

The thunks call `fetch()` and then usually call `res.json()` without checking `res.ok`.

Why this matters:

- `fetch()` only rejects on network failure, not on HTTP 400 or 500.
- A server error can be parsed as if it were normal data.
- The UI can move into a success state after a failed request.

Recommended improvement:

- Create a shared `requestJson()` helper.
- Check `response.ok`.
- Return a clear error message for the slice.

Example shape:

```js
async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
```

## 5. Product Search Assumes Every Product Has All Fields

Reference: `src/Components/features/productsSlice.js:32` to `src/Components/features/productsSlice.js:37`.

Search assumes every product has:

- `nome`
- `alias`
- `categorias`

Why this matters:

- If the API returns one incomplete product, search can crash.
- Frontend code should be defensive around external data.

Recommended improvement:

- Normalize products when they arrive from the API.
- Use safe defaults for optional fields.
- Consider validating API response shape.

## 6. React List Keys Are Random On Every Render

Reference: `src/Components/homeComponents/Motives.jsx:36`.

The component uses:

```js
const key = crypto.randomUUID();
```

Why this matters:

- React keys should be stable between renders.
- Random keys make React destroy and recreate list items unnecessarily.
- This can break animations, lose local state, and reduce performance.

Recommended improvement:

- Use stable data as the key, such as `item.texto`, a real id, or a fixed slug.

## 7. Random Phrase Selection Has An Off-By-One Error

Reference: `src/Components/productsComponents/ProductMain.jsx:28`.

The array contains four phrases, but the random index is based on `Math.floor(Math.random() * 3)`, which only returns `0`, `1`, or `2`.

Why this matters:

- The fourth phrase is never shown.
- This is a small example of why array length should drive index logic.

Recommended improvement:

- Use `phrases.length` instead of a hard-coded number.

## 8. Product Detail Can Render Before Product Data Exists

Reference: `src/Components/productsComponents/Product.jsx`.

`currentProduct` starts as `{}`. The component destructures fields from it before knowing if a real product was found.

Why this matters:

- Some fields can be `undefined`.
- The price calculation can produce `NaN`.
- A missing product id should show a not-found or error state.

Recommended improvement:

- Add an explicit "no product found" state.
- Only enable cart actions when required fields exist.

## 9. Forms Need Better Semantics

Reference examples:

- `src/Components/loginComponents/Input.jsx:7`
- `src/Components/loginComponents/LoginMain.jsx:30`
- `src/Components/loginComponents/SignupMain.jsx:36`

The input component does not accept `type`, `name`, `id`, `label`, or `autoComplete`.

Why this matters:

- Password fields behave like normal text fields.
- Screen readers have less context.
- Browsers cannot help users with credential autocomplete.

Recommended improvement:

- Make `Input` accept label and type props.
- Use `type="password"` for password fields.
- Add `autoComplete="username"`, `autoComplete="current-password"`, and `autoComplete="new-password"` as appropriate.

## 10. Inline Styles Make Design Harder To Maintain

Reference examples:

- `src/Components/productsComponents/Product.jsx:63`
- `src/Components/cartComponents/CartMain.jsx`
- `src/Components/Error.jsx`
- `src/Pages/NotFound.jsx`

Why this matters:

- Inline styles are harder to reuse.
- CSS behavior becomes scattered across JSX and CSS modules.
- Responsive rules are much harder to apply.

Recommended improvement:

- Move repeated styles into CSS modules.
- Keep inline styles only for truly dynamic values.

## 11. Naming And Folder Structure Can Be More Consistent

Examples:

- `Storager.jsx` is not a clear name.
- `Components/features` mixes component folders with Redux state files.
- Some names are English, some Portuguese, and some misspelled, such as `Proposit`.

Why this matters:

- Naming is part of architecture.
- Good names reduce the amount of explanation future readers need.

Recommended improvement:

- Rename conceptually:
  - `Storager` -> `AppBootstrap` or `StateHydrator`.
  - `Components/features` -> `features`.
  - `Proposit` -> `PurposeSection` or `Proposito`.

## 12. No Automated Tests

Reference: `package.json` has `build` and `lint` scripts, but no test script.

Why this matters:

- Current bugs would be easy to catch with small tests.
- Manual testing becomes slower as the project grows.

Recommended improvement:

- Add Vitest for reducers and helper functions.
- Add React Testing Library for forms and route guards.
- Add one Playwright test for the main user journey.

