const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "../.env" });
const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        connectTimeoutMS: 100000,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connect");
    })
    .catch((err) => {
        console.log(err);
    });

