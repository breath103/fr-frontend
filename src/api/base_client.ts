import ky from "ky";

export interface RequestOptions {
  operationId: string;
  path: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
  queryParameters: { [key: string]: any };
  headers: { [key: string]: any };
  body?: { [key: string]: any };
}

export interface Response {
  statusCode: number;
  headers: { [key: string]: string };
  body: any;
}

export class BaseClient {
  private readonly kyClient: typeof ky;

  constructor(setting: {
    prefixUrl: string;
    headers: { [key: string]: string };
  }) {
    this.kyClient = ky.extend({
      prefixUrl: setting.prefixUrl,
      headers: setting.headers,
    });
  }

  protected request<Data>(options: RequestOptions) {
    const path = `${options.path.slice(1)}`;
    return this.kyClient(path, {
      method: options.method,
      searchParams: 
        Object.keys(options.queryParameters).reduce((acc, key) => {
          if (options.queryParameters[key] !== undefined) {
            acc[key] = options.queryParameters[key];
          }
          return acc;
        }, {} as { [key: string]: any }),
      ...(Object.keys(options.body ?? {}).length > 0 ? { json: options.body } : {}),
    }).json<Data>();
  }
}
