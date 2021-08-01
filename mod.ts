const quotes = [
  {quote: "A sunny day.", author: "Jay Three"},
  {quote: "We need! Yes!", author: "Marack Bomana"},
]

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

//todo: use pathname
//todo: error handling
//todo: react to content-type
async function handleRequest(request: Request) {

  if (request.method == "GET") {

    const quote = getQuote();
    return new Response(JSON.stringify(quote),{
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    })

  } else if (request.method == "POST") {

    const json = await request.json();
    const quote = setQuote(json);
    return new Response(JSON.stringify(quote),{
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    })
   
  } else {

    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
    
  }
}

// todo: error handling
function getQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// todo: error handling
// todo: validate input
function setQuote(json) {
  quotes.push(json);
  return json;
}