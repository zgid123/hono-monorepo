export interface ICreateUserParams {
  readonly name: string;
  readonly email: string;
  readonly image?: string;
  readonly password: string;
  readonly displayName?: string;
}

export interface IUserProvisioner {
  create(params: ICreateUserParams): Promise<void>;
}
