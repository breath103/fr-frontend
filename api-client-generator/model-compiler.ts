import * as debug from "debug";
import { compile as JSONSchemaToTS, JSONSchema } from "json-schema-to-typescript";
import { SchemasObject } from "openapi3-ts";
import * as traverse from "traverse";
import * as ts from "typescript";

/**
 * The Goal of ModelCompiler class is compiling "Model" type definition from given JSONSchema.
 * It takes an JSONSchema objects and returns compiled TypeScript source code.
 */
export class ModelCompiler {
  protected readonly log = debug("api-client:ModelCompiler");

  public constructor(private readonly schemas: SchemasObject) {}

  public async compile() {
    // To get merged Type Definition, Supply anyOf schema which contains all Schemas.
    const input = this.createUnionTypeSchema(this.schemas);
    const compiled = await JSONSchemaToTS(input, "___PROTO___");

    // Then, Remove anyOf schema type from compiled source
    // and convert interface declarations to type declaration.
    return this.transform(compiled);
  }

  private async transform(source: string) {
    const inputSource = ts.createSourceFile("input", source, ts.ScriptTarget.Latest);
    const outputSource = ts.createSourceFile("output", "", ts.ScriptTarget.Latest);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    const emittedSources: string[] = [];
    inputSource.forEachChild((node) => {
      if (ts.isInterfaceDeclaration(node)) {
        // Ignore compiled anyOf schema type
        if (node.name.text === "___PROTO___") {
          return;
        }

        // Convert interface to type
        const typeNode = ts.factory.createTypeAliasDeclaration(
          node.decorators,
          node.modifiers,
          node.name.text,
          node.typeParameters,
          ts.factory.createTypeLiteralNode(
            node.members,
          ),
        );

        emittedSources.push(
          printer.printNode(ts.EmitHint.Unspecified, typeNode, outputSource),
        );
      } else {
        emittedSources.push(
          printer.printNode(ts.EmitHint.Unspecified, node, inputSource),
        );
      }
    });

    return emittedSources.join("\n\n");
  }

  private createUnionTypeSchema(schemas: SchemasObject): JSONSchema {
    return {
      type: "object",
      properties: {
        a: {
          anyOf: Object.keys(schemas)
            .map((schemaName) => ({ $ref: `#/definitions/${schemaName}` })),
        },
      },
      definitions: traverse(schemas).map(function (node) {
        if (this.key === "$ref") {
          const schemaName = node.slice(node.lastIndexOf("/") + 1);
          this.update(`#/definitions/${schemaName}`);
        }

        // Inject `additionalProperties: false` as default value
        // to prevent generating `[key: string]: unknown;` indexed type
        if (node?.type === "object" && !node.hasOwnProperty("additionalProperties")) {
          // noinspection JSPotentiallyInvalidUsageOfClassThis
          this.update({
            ...node,
            additionalProperties: false,
          });
        }
      }),
      required: ["a"],
      additionalProperties: false,
    };
  }
}
