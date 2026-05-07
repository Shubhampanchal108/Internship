const express = require("express");
const app = express();

const PORT = 5000;

// Data Arrays
const quotes = [
  "Success is not final.",
  "Code never lies.",
  "Dream big, work hard.",
  "Consistency beats talent."
];

const jokes = [
  "Why do programmers hate nature? Too many bugs.",
  "Java developers wear glasses because they don't C#.",
  "Why was the computer cold? It left Windows open."
];

const facts = [
  "JavaScript was created in 10 days.",
  "The first computer bug was a real insect.",
  "AI stands for Artificial Intelligence."
];

// Store previous indexes
let lastQuote = -1;
let lastJoke = -1;
let lastFact = -1;

// Function to avoid repetition
function getRandom(arr, lastIndexObj) {
  let index;

  do {
    index = Math.floor(Math.random() * arr.length);
  } while (index === lastIndexObj.value);

  lastIndexObj.value = index;

  return arr[index];
}

// Endpoints

app.get("/quote", (req, res) => {
  const quote = getRandom(quotes, { value: lastQuote });
  lastQuote = quotes.indexOf(quote);

  res.json({
    type: "quote",
    data: quote
  });
});

app.get("/joke", (req, res) => {
  const joke = getRandom(jokes, { value: lastJoke });
  lastJoke = jokes.indexOf(joke);

  res.json({
    type: "joke",
    data: joke
  });
});

app.get("/fact", (req, res) => {
  const fact = getRandom(facts, { value: lastFact });
  lastFact = facts.indexOf(fact);

  res.json({
    type: "fact",
    data: fact
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});