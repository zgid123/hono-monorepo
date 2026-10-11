import {
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getLocale, type Locale, setLocale } from './paraglide/runtime';

interface IChangeLocaleParams {
  locale: Locale;
}

interface ILocaleContext {
  locale: Locale;
  changeLocale: (params: IChangeLocaleParams) => void;
}

const LocaleContext = createContext<ILocaleContext | null>(null);

interface ILocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({
  children,
}: ILocaleProviderProps): JSX.Element {
  const [locale, setCurrentLocale] = useState(getLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function changeLocale({ locale: nextLocale }: IChangeLocaleParams): void {
    setLocale(nextLocale, {
      reload: false,
    });
    setCurrentLocale(nextLocale);
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        changeLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): ILocaleContext {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }

  return context;
}
