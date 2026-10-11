import type { JSX, ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

interface ILayoutProps {
  children: ReactNode;
}

export function BasicLayout({ children }: ILayoutProps): JSX.Element {
  return (
    <>
      <Header />
      <div className='mx-auto flex flex-1 flex-col py-12 w-[min(1080px,calc(100%-2rem))]'>
        {children}
      </div>
      <Footer />
    </>
  );
}
