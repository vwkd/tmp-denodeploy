addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/text")) {
    return new Response(`A sunny day`,
      {
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      }
    );
  }

  if (pathname.startsWith("/json")) {
    return new Response(
      JSON.stringify({
        message: `A sunny day`,
      }),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      }
    );
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>Example</h1>
        <p>Hello World</p>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}