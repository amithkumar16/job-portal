// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://70bbd2dfa2a6840b517d53659e3345e7@o4508965011783680.ingest.us.sentry.io/4508965017944064",
 
    integrations: [Sentry.mongooseIntegration()],
  
  
});