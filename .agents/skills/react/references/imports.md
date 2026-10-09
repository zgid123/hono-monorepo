---
name: React Imports
description: How to import React, hooks, types, and third-party libraries in Alpha's React projects.
---

# Imports

## React and JSX

Never use `import * as React from 'react'` or `import React from 'react'`. Import only the specific APIs you need by name. Modern React projects with the automatic JSX transform do not require importing React in files that only contain JSX.

```tsx
// ✅ Named imports for hooks and types you actually use
import { useState, useEffect } from 'react';

// ✅ No React import needed in files that only render JSX (automatic JSX transform)
function Greeting(): JSX.Element {
  return <p>Hello</p>;
}

// ✅ Import the JSX namespace only when you need the JSX.Element type outside JSX files
import type { JSX } from 'react';

// ❌ Namespace import — never do this
import * as React from 'react';

// ❌ Default import — only required for older React setups without the automatic transform
import React from 'react';
```

## Hooks

Import hooks individually by name. Never call them through a React namespace reference.

```tsx
// ✅ Named hook imports
import { useCallback, useMemo, useRef, useState } from 'react';

// ❌ Namespace access
const [count, setCount] = React.useState(0);
```

## Third-Party UI Libraries

Follow the TypeScript imports skill (relative, `#/` aliases, workspace packages). Apply the same rules to component libraries: import by name, not by namespace.

```tsx
// ✅ Named import from a component library
import { Button, Input } from '@acme/ui';

// ❌ Namespace import
import * as UI from '@acme/ui';
```
