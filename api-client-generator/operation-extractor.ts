import * as assert from "assert";
import * as _ from "lodash";
import {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
} from "openapi3-ts";

export type Operation = {
  schema: OperationObject;
  id: string;
  path: string;
  method: string;
  params: {
    path: string[];
    query: string[];
    body: string[];
    schema: SchemaObject;
  };
  requestModelName: string | null;
  responseModelName: string | null;
};

export class OperationExtractor {
  public constructor(
    private readonly definition: OpenAPIObject,
  ) {}

  public extract(): Operation[] {
    return Object.entries(this.definition.paths!)
      .flatMap(([path, pathItem]) =>
        Object.entries(pathItem).reduce((collection, [method, operation]) => {
          if (this.isOperationObject(operation)) {
            collection.push(this.extractOperation(path, method, operation));
          }

          return collection;
        }, [] as Operation[]),
      );
  }

  private extractOperation(
    path: string,
    method: string,
    operation: OperationObject & Pick<Required<OperationObject>, "operationId">,
  ): Operation {
    const params = {
      path: [] as string[],
      query: [] as string[],
      body: [] as string[],
      schema: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      } as SchemaObject,
    };

    for (const parameter of operation.parameters ?? []) {
      assert.ok(
        !parameter.$ref,
        `Operation "${operation.operationId}" (${method} ${path}) have unsupported parameter reference`,
      );

      const { in: location, name, required, schema } = parameter as ParameterObject;

      if (location === "path" || location === "query") {
        params[location].push(name);
        params.schema.properties![name] = schema!;

        if (required) {
          params.schema.required!.push(name);
        }
      }
    }

    if (operation.requestBody) {
      assert.ok(
        !operation.requestBody.$ref,
        `Operation "${operation.operationId}" (${method} ${path}) have unsupported parameter reference`,
      );

      const jsonMedia = (operation.requestBody as RequestBodyObject).content["application/json"];
      assert.ok(
        jsonMedia,
        `Operation "${operation.operationId}" (${method} ${path}) does not support JSON content type`,
      );
      assert.ok(
        jsonMedia.schema,
        `Operation "${operation.operationId}" (${method} ${path}) does not have body schema`,
      );
      assert.ok(
        !jsonMedia.schema.$ref,
        `Operation "${operation.operationId}" (${method} ${path}) have unsupported parameter reference`,
      );
      assert.ok(
        (jsonMedia.schema as SchemaObject).type === "object",
        `Operation "${operation.operationId}" (${method} ${path}) have unsupported body schema type`,
      );

      const bodySchema = jsonMedia.schema as SchemaObject;
      params.body.push(...Object.keys(bodySchema.properties!));
      params.schema.required!.push(...(bodySchema.required ?? []));
      Object.assign(params.schema.properties, bodySchema.properties);
    }

    const requestModelName = Object.keys(params.schema.properties!).length > 0
      ? `${_.capitalize(operation.operationId.slice(0, 1))}${operation.operationId.slice(1)}Parameter`
      : null;

    const responseModelName: string | null = (() => {
      const successResponse = operation.responses["200"] as ResponseObject | undefined;
      assert.ok(
        successResponse,
        `Operation "${operation.operationId}" (${method} ${path}) does not have proper 200 response`,
      );

      const $ref = successResponse.content?.["application/json"]?.schema?.$ref ?? null;
      return $ref
        ? this.extractModelName($ref)
        : null;
    })();

    return {
      schema: operation,
      id: operation.operationId,
      path,
      method: method.toUpperCase(),
      params,
      requestModelName,
      responseModelName,
    };
  }

  private extractModelName(input: string) {
    return input.slice(input.lastIndexOf("/") + 1);
  }

  private isOperationObject(value: any): value is OperationObject & Pick<Required<OperationObject>, "operationId">  {
    return typeof value?.operationId === "string";
  }
}
