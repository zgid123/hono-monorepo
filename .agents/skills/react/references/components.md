---
name: React Components
description: Component declaration, return types, props interfaces, and JSX conventions for Alpha's React projects.
---

# Components

## Declaration Style

Always declare components with the `function` keyword. Never assign a component to a `const` as an arrow function.

```tsx
// ✅ Function declaration with named export
export function UserCard({ name, email }: IUserCardProps): JSX.Element {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// ❌ Arrow function constant
const UserCard = ({ name, email }: IUserCardProps): JSX.Element => {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
};

// ❌ Default export
export default function UserCard({ name, email }: IUserCardProps): JSX.Element {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}
```

## Exports

Always export components with a named `export`. Never use `export default` except in **router files** where the framework requires it — specifically Next.js page/layout files and TanStack Start route files.

```tsx
// ✅ Named export — use everywhere outside router files
export function UserCard({ name, email }: IUserCardProps): JSX.Element {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// ✅ Default export — allowed only in framework router files (Next.js pages/layouts, TanStack Start routes)
// app/dashboard/page.tsx
export default function DashboardPage(): JSX.Element {
  return <main>Dashboard</main>;
}

// ❌ Default export on a regular component
export default function UserCard({ name, email }: IUserCardProps): JSX.Element {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// ❌ Detached default export
export default UserCard;
```

## Return Type

Every component must declare an explicit return type. Use `JSX.Element` as the minimum. Use `JSX.Element | null` when the component may render nothing.

```tsx
// ✅ Always annotate the return type
function LoadingSpinner(): JSX.Element {
  return <span>Loading…</span>;
}

// ✅ Use | null when the component can render nothing
function ErrorBanner({ message }: IErrorBannerProps): JSX.Element | null {
  if (!message) {
    return null;
  }

  return <p>{message}</p>;
}

// ❌ Missing return type annotation
function LoadingSpinner() {
  return <span>Loading…</span>;
}
```

## Props Interface

The props interface for a component must be named `I<ComponentName>Props`. Place it immediately above the component it belongs to. Follow the TypeScript skill interface prefix convention (`I`).

```tsx
// ✅ Interface named IUserCardProps, placed directly above the component
interface IUserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: IUserCardProps): JSX.Element {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// ❌ Props named without the I prefix and component name
interface UserCardProps {
  name: string;
  email: string;
}

// ❌ Generic or unrelated name
interface IProps {
  name: string;
  email: string;
}
```

## Destructuring Props

Follow the TypeScript skill destructuring rule: destructure at the first level in the function signature. Do not destructure nested props in the signature; handle them inside the component body.

```tsx
// ✅ First-level destructuring in the signature
function ProductRow({ id, price, label }: IProductRowProps): JSX.Element {
  return (
    <tr>
      <td>{id}</td>
      <td>{label}</td>
      <td>{price}</td>
    </tr>
  );
}

// ❌ Accessing props through the parameter object
function ProductRow(props: IProductRowProps): JSX.Element {
  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.label}</td>
      <td>{props.price}</td>
    </tr>
  );
}
```
