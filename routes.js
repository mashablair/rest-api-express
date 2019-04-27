const express = require("express");
const router = express.Router();
const records = require("./records");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// ROUTE HANDLERS
// Send a GET request to /quotes to READ a list of quotes
router.get(
  "/quotes",
  asyncHandler(async (req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
  })
);

// Send a GET request to /quotes/:id to READ (view) a quote
router.get(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "Quote NOT found" });
    }
  })
);

// Send a POST request to /quotes to CREATE a new quote
router.post(
  "/quotes",
  asyncHandler(async (req, res) => {
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
  })
);

// Send a PUT request to /quotes/:id to UPDATE or edit a quote
router.put(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end(); // this tells Express that we are done
    } else {
      res.status(404).json({ message: "Quote Not Found" });
    }
  })
);

// Send a DELETE request to /quotes/: id to DELETE a quote
router.delete(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      await records.deleteQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Not valid quote ID" });
    }
  })
);

// Send a GET request to /quotes/quote/random READ (view) a random quote

module.exports = router;
