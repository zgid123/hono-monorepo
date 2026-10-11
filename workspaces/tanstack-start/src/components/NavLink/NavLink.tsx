import { Link, type LinkProps } from '@tanstack/react-router';
import type { JSX, ReactNode } from 'react';

interface INavLinkProps {
  to: LinkProps['to'];
  children: ReactNode;
}

export function NavLink({ children, to }: INavLinkProps): JSX.Element {
  return (
    <Link
      activeProps={{
        className: 'text-foreground-primary after:scale-x-100',
      }}
      className="relative no-underline after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:from-lagoon after:to-lagoon-mid after:content-[''] after:transition-transform after:duration-170 hover:text-foreground-primary hover:after:scale-x-100"
      inactiveProps={{
        className: 'text-foreground-secondary',
      }}
      to={to}
    >
      {children}
    </Link>
  );
}
