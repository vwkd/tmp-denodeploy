const quotes = [
  { quote: "A sunny day.", author: "Jay Three" },
  { quote: "We need! Yes!", author: "Marack Bomana" },
];

// todo: error handling
export async function getQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// todo: error handling
// todo: validate input
export async function setQuote(json) {
  quotes.push(json);
  return json;
}
