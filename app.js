const express = require("express");
const app = express();
const records = require("./records");

// express middleware --
// when request comes in, it will go through this function before it hits one of our route handlers below
// we expect request to come in as JSON
app.use(express.json());

// ROUTE HANDLERS
// Send a GET request to /quotes to READ a list of quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Send a GET request to /quotes/:id to READ (view) a quote
app.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "Quote NOT found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a POST request to /quotes to CREATE a new quote
app.post("/quotes", async (req, res) => {
  try {
    // this error line is for error testing
    // throw new Error("Oh no!!!!");
    if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author
      });
      res.status(201).json(quote); // here we add status 201 = new record created
    } else {
      // bad request
      res.status(400).json({ message: "Quote and author are required" });
    }
  } catch (err) {
    // by default status code is 200 OK, but here we change that in case of error:
    res.status(500).json({ message: err.message });
  }
});
// Send a PUT request to /quotes/:id to UPDATE or edit a quote
// Send a DELETE request to /quotes/: id to DELETE a quote
// Send a GET request to /quotes/quote/random READ (view) a random quote

app.listen(3000, () => console.log("Quote API listening on port 3000!"));
