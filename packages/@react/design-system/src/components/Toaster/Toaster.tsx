import { Toaster as ShadcnToaster } from '@react/shadcn-ui/components/sonner';
import { cn } from '@react/shadcn-ui/lib/utils';

export { toast } from '@react/shadcn-ui/lib/toast';

import type { ComponentProps, JSX } from 'react';

export interface IToasterProps extends ComponentProps<typeof ShadcnToaster> {}

export function Toaster({
  className,
  closeButton = true,
  position = 'top-right',
  ...rest
}: IToasterProps): JSX.Element {
  return (
    <ShadcnToaster
      className={cn('toaster', className)}
      closeButton={closeButton}
      position={position}
      {...rest}
    />
  );
}
