import type { Cqrsx } from '@cqrsx/core';

import type { TDrizzle } from '#/infrastructure/drizzle/config';
import { wireAuth } from '#/modules/auth/adapters/restful/wire';

export interface IWireContainer {
  cqrsx: Cqrsx;
  drizzle: TDrizzle;
  [key: string]: unknown;
}

interface IWireParams {
  cqrsx: Cqrsx;
  drizzle: TDrizzle;
}

export function wire({ cqrsx, drizzle }: IWireParams): IWireContainer {
  wireAuth({
    cqrsx,
    drizzle,
  });

  return {
    cqrsx,
    drizzle,
  };
}
