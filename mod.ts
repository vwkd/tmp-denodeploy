import { log } from "./log.ts";
import {
  Application,
  isHttpError,
  Router,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { getData, setData } from "./data.ts";

// --------------------------------------------------------------------------------

const app = new Application();
const router = new Router();

router
  .get("/quote", getQuote)
  .post("/quote", setQuote);

app.use(logger);
app.use(errorHandler);
app.use(checkJSON);
app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());

// --------------------------------------------------------------------------------

async function logger(ctx, next) {
  log.info("-->", ctx.request.method, ctx.request.url.pathname);
  await next();
  log.info("<--", ctx.response.status);
}

// todo: figure out why throwing error is necessary for correct response
// why the "<--" log isn't reached, and how to then prevent "uncaught oak error" in console
async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      log.info(err.name, err.message);
    } else {
      log.critical(err);
    }
    throw err;
  }
}

async function checkJSON(ctx, next) {
  log.debug("Accept Header:", ctx.request.accepts());
  const wantsJSON = ctx.request.accepts("application/json") !== undefined;
  ctx.assert(wantsJSON, 406, "Response body must be JSON");
  await next();
}

async function getQuote(ctx, next) {
  const value = await getData();
  log.debug("Got value:", value);
  ctx.response.body = value;
  await next();
}

async function setQuote(ctx, next) {
  if (ctx.request.hasBody) {
    log.debug("Content-Type Header:", ctx.request.body().type);
    const isJSON = ctx.request.body().type == "json";
    ctx.assert(isJSON, 406, "Request body must be JSON");

    let content;
    try {
      content = await ctx.request.body({ type: "json" }).value;
    } catch (e) {
      ctx.throw(400, "Request body is invalid JSON");
    }

    log.debug("Set value...", content);
    const value = await setData(content);
    log.debug("Got value:", value);
    ctx.response.body = value;
  } else {
    ctx.throw(400, "Request body is empty");
  }
  await next();
}
