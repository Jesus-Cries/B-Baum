const express = require("express");
const path = require("path");

const app = express();

// Serve production build
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Application started on port ${port}`);
});
