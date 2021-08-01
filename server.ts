import {
  Application,
  isHttpError,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";

// todo: outsource
const log = {
  debug(...args) {
    console.log("DEBUG:", ...args);
  },
  info(...args) {
    console.log("INFO:", ...args);
  },
  critical(...args) {
    console.log("CRITICAL:", ...args);
  },
};

const app = new Application();
//todo: figure out why calling await next() is necessary
//todo: add logging

// todo: outsource, handleError
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      log.info(err.name, err.message);
    } else {
      log.critical(err); //err.message
      throw err;
    }
  }
});

app.use(verifyAcceptHeader);

app.use(handlePOST);

await app.listen("127.0.0.1:8000");

// --------------------------------------------------------------------------------
// todo: outsource

async function verifyAcceptHeader(ctx, next) {
  log.debug("Accept Header:", ctx.request.accepts());
  const acceptsJSON = ctx.request.accepts("application/json") !== undefined;
  ctx.assert(acceptsJSON, 406, "Only provides JSON.");
  await next();
}

async function handlePOST(ctx, next) {
  if (ctx.request.hasBody) {

    // verify Content-Type
    // todo: outsource if possible
    log.debug("Content-Type Header:", ctx.request.body().type);
    const providesJSON = ctx.request.body().type == "json";
    ctx.assert(providesJSON, 406, "Only accepts JSON");

    const value = await ctx.request.body({ type: "json" }).value;
    // todo: validate
    // todo: save
    log.debug("value:", value);
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
