export interface IApplicationErrorParams {
  readonly code: number;
  readonly name: string;
  readonly message: string;
  readonly httpCode: number;
}

export class ApplicationError extends Error {
  public readonly code: number;
  public readonly httpCode: number;

  public constructor({
    code,
    name,
    message,
    httpCode,
  }: IApplicationErrorParams) {
    super(message);

    this.code = code;
    this.name = name;
    this.httpCode = httpCode;
  }
}
