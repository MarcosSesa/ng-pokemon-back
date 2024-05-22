const express = require("express");
const app = express();
const port = 3000;

const cardsRouter = require("./routes/cards");

app.use("/", cardsRouter);

app.listen(port, () => {
  console.log(require("crypto").randomBytes(64).toString("hex"));
});