import {
  AvatarFallback,
  AvatarImage,
  Avatar as ShadcnAvatar,
} from '@react/shadcn-ui/components/avatar';
import { cn } from '@react/shadcn-ui/lib/utils';
import type { ComponentProps, JSX } from 'react';

export interface IAvatarProps
  extends Omit<ComponentProps<typeof ShadcnAvatar>, 'children'> {
  name: string;
  src?: string | null;
}

export function Avatar({ name, src, ...rest }: IAvatarProps): JSX.Element {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <ShadcnAvatar aria-label={name || initial} role='img' {...rest}>
      {src && <AvatarImage alt='' src={src} />}
      <AvatarFallback
        className={cn(
          'bg-tertiary',
          'text-xs font-medium text-foreground-secondary',
        )}
      >
        {initial}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
