const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
  res.send("Acerca de las cartas");
});

module.exports = router;