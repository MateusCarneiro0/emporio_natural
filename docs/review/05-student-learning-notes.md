# Student Learning Notes

This file explains the main review points in a teaching style.

## 1. A Working App Is The First Step, Not The Last Step

This project already shows important React skills:

- components,
- props,
- route pages,
- Redux state,
- async actions,
- CSS Modules,
- environment variables,
- deployment rewrites.

The next stage is learning how to make the code reliable and easy to change.

A useful question to ask while coding:

```text
If this project doubles in size, will this file still be easy to understand?
```

If the answer is no, the code may need better separation.

## 2. Separation Of Concerns

Separation of concerns means each file should have a clear job.

In this project, Redux slices currently do many jobs:

- store state,
- change state,
- call the API,
- build URLs,
- write to localStorage,
- interpret backend responses.

That is normal while learning, but a cleaner structure is:

```text
Component: displays UI and handles user events
Slice: stores state and reducers
Thunk: coordinates async behavior
API module: talks to the backend
Storage helper: talks to localStorage
```

Why this helps:

- Bugs are easier to find.
- Tests are easier to write.
- Files become smaller.
- Future features are less risky.

## 3. Why Stable React Keys Matter

React keys tell React which item is which between renders.

Bad key:

```js
key={crypto.randomUUID()}
```

This creates a new key every render. React thinks every item is brand new.

Better key:

```js
key={item.texto}
```

Even better:

```js
key={item.id}
```

The idea:

```text
Stable key: "this is the same item as before"
Random key: "this is a completely new item"
```

## 4. Why `fetch` Needs `response.ok`

Many beginners think `fetch()` fails whenever the server returns an error. It does not.

`fetch()` rejects for network problems, but a `404` or `500` response still counts as a completed HTTP response.

That means this can be misleading:

```js
const res = await fetch(url);
const data = await res.json();
```

Better thinking:

```text
Did the network request complete?
   |
   +-- yes
        |
        +-- did the server say success?
```

That second question is `response.ok`.

## 5. Why localStorage Needs Defensive Code

localStorage is outside React. It can contain old, empty, or manually edited values.

This is risky:

```js
JSON.parse(localStorage.getItem("id"))
```

Because malformed data can crash parsing.

Better habit:

- read the value,
- check if it exists,
- parse inside `try/catch`,
- return `null` if invalid.

The app should treat invalid storage as "user is logged out."

## 6. Why Fixed Layouts Break

Fixed values are tempting:

```css
height: 700px;
font-size: 80px;
margin-right: 225px;
```

They can work on your laptop, but fail on:

- phones,
- tablets,
- browser zoom,
- long product names,
- translated text,
- users with larger default fonts.

Better CSS uses relationships:

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 20px;
min-height: 70vh;
```

Good layout adapts to content and screen size.

## 7. Why Forms Need Labels

Placeholder text is not a label. A placeholder disappears when the user types.

Good form fields answer:

- What is this input?
- What format is expected?
- Is the value valid?
- What went wrong?

For login:

```text
Username
[ input ]

Password
[ password input ]
```

Also use correct browser hints:

- username input: `autoComplete="username"`
- login password: `autoComplete="current-password"`
- signup password: `autoComplete="new-password"`

## 8. How To Think About Authentication

The current app stores the user id in localStorage and restores the user from the API.

For a learning project, this is understandable. For a real production app, authentication usually needs:

- server-issued session or token,
- expiration,
- secure storage strategy,
- logout that invalidates the session,
- backend authorization checks.

Important idea:

```text
Frontend route protection improves user experience.
Backend authorization provides real security.
```

Do not rely only on React route guards for security.

## 9. How To Improve Without Getting Lost

A good student workflow:

1. Fix one behavior bug.
2. Test it manually.
3. Commit it.
4. Refactor one small area.
5. Test again.
6. Repeat.

Avoid trying to rewrite the whole app at once. Large rewrites often create new bugs.

## 10. Best Next Learning Goals

Study these topics next:

- React component composition.
- Redux Toolkit `createAsyncThunk`.
- Error handling with `fetch`.
- CSS Grid responsive layouts.
- Accessible forms.
- React Testing Library.
- Vitest.
- Basic end-to-end testing with Playwright.

These topics connect directly to the current project, so learning them will immediately improve the app.

