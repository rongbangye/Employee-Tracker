const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", function (req, res) {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
