---
name: React Project Structure
description: Feature-based folder structure for Alpha's React projects.
---

# Project Structure

React projects follow a **feature-based** structure. Code is grouped by domain area (feature), not by technical role. This keeps everything a feature needs in one place and avoids cross-feature coupling.

## Top-Level Layout

```
src/
  components/       # shared components used by two or more features, or globally
  features/         # one folder per domain area
    <feature>/
      components/   # pure presentational components — no data fetching, no business logic
      hooks/        # shared hooks used by two or more components or widgets within this feature
      utils/        # pure helper functions with no React dependency
      widgets/      # smart components that compose components + hooks into feature UI
      index.ts      # public barrel — the only allowed import surface for other features
```

## `src/components` — Shared Components

Contains only components that are **used by two or more features** or are inherently global (layout shells, design-system primitives, navigation).

Each component is a **folder** containing the component file and an `index.ts` barrel — the same convention as feature components.

- A component that belongs to exactly one feature must live inside that feature, not here.
- Promote a component from a feature to `src/components` only when a second feature needs it.
- Never import from a specific feature folder from inside `src/components`.

```
src/components/
  Button/
    Button.tsx
    index.ts     # export { Button } from './Button'
  Modal/
    Modal.tsx
    index.ts     # export { Modal } from './Modal'
```


## `src/features/<feature>` — Feature Slices

Each feature folder is a self-contained vertical slice with four sub-folders and a public barrel.

```
src/features/
  auth/
    components/
      LoginForm/
        LoginForm.tsx         # pure form UI — receives values and callbacks via props
        index.ts
      LoginField/
        LoginField.tsx        # pure input field used by LoginForm
        index.ts
    hooks/
      useAuthStatus.ts      # shared: used by both LoginWidget and ProfileWidget
    utils/
      formatAuthError.ts    # maps an error code to a display string
    widgets/
      LoginWidget/
        LoginWidget.tsx     # component
        hooks.ts            # hook used only by LoginWidget — co-located here, not in hooks/
        index.ts            # barrel: export { LoginWidget } from './LoginWidget'
      ProfileWidget/
        ProfileWidget.tsx
        hooks.ts
        index.ts
    index.ts
  dashboard/
    components/
      StatCard/
        StatCard.tsx
        index.ts
    hooks/
      useDashboardStats.ts  # shared: used by two or more widgets
    widgets/
      DashboardWidget/
        DashboardWidget.tsx
        index.ts            # no hooks.ts needed if widget uses only the shared hook
    index.ts
```

### `components/` — Pure Presentational Components

Each component is a **folder** containing the component file and an `index.ts` barrel:

```
components/
  LoginForm/
    LoginForm.tsx
    index.ts     # export { LoginForm } from './LoginForm'
```

- Receive everything through props; own no external state or data fetching.
- Testable in isolation with no mocking of hooks or stores.
- May have local UI state (e.g. `isOpen` for an internal dropdown), but never fetch data.

### `hooks/` — Shared Feature Hooks

- Contains only hooks **used by two or more widgets** within the same feature.
- If a hook is only used by one widget, place it as `hooks.ts` inside that widget's folder instead.
- Move a widget-local `hooks.ts` into the shared `hooks/` folder only when a second widget needs it — same promotion rule as for components.
- Return values and callbacks only; never render JSX.

### `utils/` — Pure Helpers

- Plain TypeScript functions — no React imports, no side-effects.
- Always pure: same input → same output.
- Easily unit-tested without any rendering setup.

### `widgets/` — Smart Container Components

Each widget is a **folder** containing three files:

- `<WidgetName>.tsx` — the component itself.
- `hooks.ts` — the widget-private hook (omit if the widget only consumes shared feature hooks).
- `index.ts` — barrel that re-exports the component as the public surface of the widget folder.

```tsx
// widgets/LoginWidget/hooks.ts
import { useState } from 'react';

export function useLoginWidget() {
  // data fetching and state local to this widget
}

// widgets/LoginWidget/LoginWidget.tsx
import { LoginForm } from '../../components/LoginForm';
import { useLoginWidget } from './hooks';

export function LoginWidget(): JSX.Element {
  const { values, errors, isLoading, handleSubmit, handleChange } = useLoginWidget();

  return (
    <LoginForm
      values={values}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
}

// widgets/LoginWidget/index.ts
export { LoginWidget } from './LoginWidget';
```

```tsx
// ❌ Mixing data fetching and rendering in one component — use a widget + component split instead
export function LoginForm(): JSX.Element {
  const { mutate, isPending } = useMutation({ mutationFn: login });
  // ...
}
```

## Feature `index.ts` — Public API

Every feature exposes a single `index.ts` barrel. Other parts of the app may only import from this barrel, never from paths inside the feature folder. Widgets are typically the main export because they are what pages and other widgets render.

```ts
// src/features/auth/index.ts
export { LoginWidget } from './widgets/LoginWidget';
export { useLogin } from './hooks/useLogin';
```

```ts
// ✅ Import through the feature barrel
import { LoginWidget } from '#/features/auth';

// ❌ Never import from inside a feature folder
import { LoginWidget } from '#/features/auth/widgets/LoginWidget';
```

## Cross-Feature Rules

- Features must not import from each other's internal folders; use the barrel only.
- If two features need to share a component, move it to `src/components`.
- If two features need to share a utility, extract it to a `src/shared/utils/` folder — introduce this only when the need arises (YAGNI).

## Router Files

Next.js and TanStack Start route files live outside `src/features`. They import widgets from feature barrels and are the only place `export default` is allowed.

```
app/                        # Next.js app router
  dashboard/
    page.tsx                # import { DashboardWidget } from '#/features/dashboard'
  auth/
    login/
      page.tsx              # import { LoginWidget } from '#/features/auth'
```
