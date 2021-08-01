import { log } from "./log.ts";
import {
  Application,
  isHttpError,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { getQuote, setQuote } from "./data.ts";

const app = new Application();

app.use(handleError);

app.use(verifyAcceptHeader);

app.use(handlePOST);

await app.listen("127.0.0.1:8000");

// --------------------------------------------------------------------------------

async function handleError(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      log.info(err.name, err.message);
    } else {
      log.critical(err);
      throw err;
    }
  }
}

async function verifyAcceptHeader(ctx, next) {
  log.debug("Accept Header:", ctx.request.accepts());
  const acceptsJSON = ctx.request.accepts("application/json") !== undefined;
  ctx.assert(acceptsJSON, 406, "Only provides JSON.");
  await next();
}

async function handleGET(ctx, next) {
  const value = await getQuote();
  log.debug("Got value:", value);
  ctx.response.body = value;
  await next();
}

async function handlePOST(ctx, next) {
  if (ctx.request.hasBody) {
    // verify Content-Type
    // todo: outsource if possible
    log.debug("Content-Type Header:", ctx.request.body().type);
    const providesJSON = ctx.request.body().type == "json";
    ctx.assert(providesJSON, 406, "Only accepts JSON");

    const content = await ctx.request.body({ type: "json" }).value;
    log.debug("Set value...", content);
    const value = await setQuote(content);
    log.debug("Got value:", value);
    ctx.response.body = value;
  } else {
    log.debug("Missing JSON body.");
    ctx.throw(400, "Missing JSON body.");
  }
  await next();
}

function verifyMethod() {
}

function verifyPath() {
}

function acceptsJson(ctx) {
  ctx.assert(ctx.request.accepts());
}
