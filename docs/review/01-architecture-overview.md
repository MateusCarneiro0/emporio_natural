# Architecture Overview

## Current Shape

Emporio Natural is a single-page React app. The browser loads `index.html`, Vite starts React from `src/main.jsx`, and the app is rendered inside a Redux `Provider`.

```text
index.html
   |
   v
src/main.jsx
   |
   +-- Redux Provider
   |
   +-- Storager
   |     |
   |     +-- fetch products
   |     +-- restore user/cart from localStorage id
   |
   v
src/App.jsx
   |
   +-- routes
       +-- /
       +-- /produtos
       +-- /produtos/:id
       +-- /cart
       +-- /login
       +-- /signup
```

## Important Files

- `src/main.jsx`: creates the React root and wraps the app with Redux and `Storager`.
- `src/App.jsx`: defines routes and lazy-loads pages.
- `src/Storager.jsx`: loads products and restores persisted auth state.
- `src/store.js`: combines Redux slices.
- `src/Components/features/authSlice.js`: authentication state and login/signup thunks.
- `src/Components/features/productsSlice.js`: product list, search, and current product state.
- `src/Components/features/cartSlice.js`: cart state and cart API actions.
- `src/Components/protectedRoutes/AuthProtected.jsx`: redirects unauthenticated users.
- `src/Components/protectedRoutes/LoggedProtected.jsx`: redirects authenticated users away from login/signup.

## State Model

```text
Redux store
   |
   +-- auth
   |     +-- authUser
   |     +-- authUserId
   |     +-- users
   |     +-- isLoading
   |     +-- isAuthenticated
   |     +-- authError
   |     +-- signupError
   |
   +-- products
   |     +-- products
   |     +-- displayProducts
   |     +-- currentProduct
   |     +-- isLoading
   |     +-- error
   |
   +-- cart
         +-- cartProducts
         +-- isLoading
         +-- error
```

This is a reasonable first structure. The main improvement is not to add more global state automatically. Use Redux for data that must be shared across pages, but keep purely local form state inside components.

## Data Flow

### Startup

1. `main.jsx` renders the app.
2. `Storager.jsx` dispatches `fetchProducts()` if products are not loaded.
3. `Storager.jsx` dispatches `getLocalStorage()` if the user is not authenticated.
4. `getLocalStorage()` reads an `id` from `localStorage`.
5. The app calls the API to restore the user and cart.

### Login

```text
Login form
   |
   v
loginUser(username, password)
   |
   v
POST /users/login
   |
   +-- if auth true:
   |     +-- auth/loginUser
   |     +-- cart/receiveCart
   |     +-- save id in localStorage
   |
   +-- if auth false:
         +-- auth/authRejected
```

### Products

```text
fetchProducts()
   |
   v
GET VITE_API_URL
   |
   v
products/receiveProducts
   |
   +-- products = all products
   +-- displayProducts = filtered products shown to the user
```

Search is done in Redux by filtering `products` into `displayProducts`.

### Cart

```text
Product detail page
   |
   v
addProductCart(product)
   |
   v
POST /users/:userId/addproductcart
   |
   v
cart/addProductCart
```

The design idea is sound: the server is the long-term source of truth, while Redux gives the UI immediate state. The next improvement is to make server failure handling stricter so the UI does not claim success when the API rejects a request.

## Current Architecture Risks

### Slices Do Too Much

The Redux slices currently combine:

- reducer logic,
- API calls,
- endpoint paths,
- localStorage writes,
- user-facing state,
- domain behavior.

That is acceptable for learning, but as the app grows it becomes difficult to test. A cleaner future structure would be:

```text
src/
   api/
      authApi.js
      productsApi.js
      cartApi.js
   app/
      store.js
   features/
      auth/
         authSlice.js
      products/
         productsSlice.js
      cart/
         cartSlice.js
   components/
   pages/
```

The goal is not to create folders for their own sake. The goal is to make each file answer one question:

- API file: "How do I talk to the server?"
- Slice file: "How does app state change?"
- Component file: "What does the user see and do?"

## Suggested Target Architecture

```text
React components
   |
   | dispatch actions / read state
   v
Redux slices
   |
   | call async thunks
   v
API modules
   |
   | fetch with shared error handling
   v
Backend API
```

Benefits:

- Easier testing.
- Less repeated `fetch` code.
- More consistent error handling.
- Easier to replace the backend URL or endpoint paths later.

