import { type } from 'arktype';

export const Timestamp = type({
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type TTimestamp = typeof Timestamp.infer;

export const BaseUuid = Timestamp.and({
  id: 'string.uuid.v7',
});

export type TBaseUuid = typeof BaseUuid.infer;

export const BaseUuidV4 = Timestamp.and({
  id: 'string.uuid',
});

export type TBaseUuidV4 = typeof BaseUuidV4.infer;

export const BaseObjectId = Timestamp.and({
  id: 'string',
});

export type TBaseObjectId = typeof BaseObjectId.infer;

export const BaseId = Timestamp.and({
  id: 'bigint',
});

export type TBaseId = typeof BaseId.infer;
