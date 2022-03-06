import { Operation } from "./operation-extractor";

export class ClientRenderer {
  public constructor(
    private readonly operations: Operation[],
    private readonly basePath: string,
  ) {}

  public async render() {
    // tslint:disable
    return `
      import * as Entity from "./entities";

      import { BaseClient } from "../base_client";

      export class Client extends BaseClient {
        constructor(headers: {
          [key: string]: string;
        }) {
          super({
            prefixUrl: "${this.basePath}",
            headers,
          });
        }

      ${this.operations.map((operation) => `
        public readonly ${operation.id} = {
          schema: JSON.parse(${JSON.stringify(JSON.stringify(operation.schema))}),
          call: (${operation.requestModelName ? `params: Entity.${operation.requestModelName}` : ""}) => {
            const path = ${
              operation.params.path.length > 0
                ? `\`${operation.path.replace(/{([^}]+)}/g, (match, name) => `\${encodeURIComponent(params["${name}"])}`)}\``
                : `"${operation.path}"`
            };

            return this.request<${operation.responseModelName ? `Entity.${operation.responseModelName}` : "unknown"}>({
              method: "${operation.method}",
              operationId: "${operation.id}",
              path,
              queryParameters: {
                ${operation.params.query.map((name) =>
                  `${name}: params["${name}"],`
                ).join("\n")}
              },
              body: {
                ${operation.params.body.map((name) =>
                  `${name}: params["${name}"],`
                ).join("\n")}
              },
              headers: {},
            })
          },
        };
      `).join("\n")}
      }
    `;
    // tslint:enable
  }
}
