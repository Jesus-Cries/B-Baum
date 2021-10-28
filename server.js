const express = require("express");
const path = require("path");

const app = express();

app.get("/api/customers", (req, res) => {
    const customers = [
        {
            id: 1,
            firstName: "Leon",
            lastName: "Obermann",
        },
        {
            id: 2,
            firstName: "Till",
            lastName: "Neumann",
        },
        {
            id: 3,
            firstName: "Edwin",
            lastName: "Sept",
        },
    ];

    res.json(customers);
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
