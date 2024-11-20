const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hi Iam Root");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
