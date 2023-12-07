const dotenv = require("dotenv");
const express = require("express");
dotenv.config({ path: "./.Env" });
const cors = require('cors');
const app = express();
require("./DB/Connect");
const port = process.env.port;

// Access-Control-Allow-Origin
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());

app.use(require("./Router/Auth"));
app.use(require("./Router/Order"));
app.use(require("./Router/CattleFeed"));
app.use(require("./Router/Inventory"));
app.use(require("./Router/UploadImage"));
app.use(require("./Router/GetData"));
app.use(require("./Router/ForgotPassword"));
app.use(require("./Router/SMS"));
app.use(require("./Router/Meta"));



app.get("/", (req, res) => {
    res.send("vijay");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});



