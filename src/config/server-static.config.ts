import { ServeStaticModuleOptions } from "@nestjs/serve-static";
import * as fs from "fs";

const uploadsPath = process.env.UPLOADS_PATH || "/static-files";

if (!fs.existsSync(uploadsPath)) {
  console.error(
    `The directory ${uploadsPath} does not exist. Please create it or set the correct path in your .env file.`,
  );
  process.exit(1);
}

export const ServerStaticConfig: ServeStaticModuleOptions = {
  rootPath: uploadsPath,
  serveRoot: "/uploads",
  serveStaticOptions: {
    index: false,
    fallthrough: false,
    maxAge: "1d",
  },
};
