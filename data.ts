const data = [
  { quote: "A sunny day.", author: "Jay Three" },
  { quote: "We need! Yes!", author: "Marack Bomana" },
];

// todo: error handling
export async function getData() {
  const index = Math.floor(Math.random() * data.length);
  return data[index];
}

// todo: error handling
// todo: validate input
export async function setData(json) {
  data.push(json);
  return json;
}
