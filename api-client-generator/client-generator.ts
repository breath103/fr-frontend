import * as debug from "debug";
import * as del from "del";
import { promises as fs } from "fs";
import got from "got";
import { OpenAPIObject, SchemasObject } from "openapi3-ts";
import * as path from "path";

import { ClientRenderer } from "./client-renderer";
import { ModelCompiler } from "./model-compiler";
import { OperationExtractor } from "./operation-extractor";

export class ClientGenerator {
  protected readonly log = debug("api-client:ClientGenerator");

  private readonly openAPISpecURL: string;
  private readonly outputDir: string;

  public constructor(openAPISpecURL: string, outputDir: string) {
    this.openAPISpecURL = openAPISpecURL;
    this.outputDir = outputDir;
  }

  public async emit() {
    await del(this.outputDir, { force: true });
    await fs.mkdir(this.outputDir);

    const definition = await got(this.openAPISpecURL, {headers: { "x-fr-auth-token": "guest:api-generator" } }).json() as OpenAPIObject;
    const operations = new OperationExtractor(definition).extract();

    const model = await new ModelCompiler({
      ...definition.components!.schemas!,
      ...operations.reduce((hash, { requestModelName, params }) => {
        if (requestModelName) {
          hash[requestModelName] = params.schema;
        }

        return hash;
      }, {} as SchemasObject),
    }).compile();
    await this.emitFile("entities.ts", model);

    const client = await new ClientRenderer(
      operations,
      definition.servers![0].url,
    ).render();
    await this.emitFile("client.ts", client);

    const index = this.renderIndex();
    await this.emitFile("index.ts", index);
  }

  private renderIndex() {
    return `
      import * as Entity from "./entities";

      export { Entity };
      export { Client } from "./client";
    `;
  }

  private async emitFile(filename: string, content: string) {
    await fs.writeFile(path.resolve(this.outputDir, filename), content);
  }
}
