import { ClientGenerator } from "./client-generator";

// tslint:disable:no-console
if (require.main === module) {
  const [url, outputDir] = process.argv.slice(2);
  console.log("Generating client from", url, "to", outputDir);
  new ClientGenerator(
    url, outputDir
  ).emit().then(console.log, console.log);
}
// tslint:enable:no-console
