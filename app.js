const express = require("express");
const app = express();
const routes = require("./routes");

// express middleware --
// when request comes in, it will go through this function before it hits one of our route handlers below
// we expect request to come in as JSON
app.use(express.json());
app.use("/api", routes);

// if some of the route handlers above don't get to run, this will run
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(3000, () => console.log("Quote API listening on port 3000!"));
