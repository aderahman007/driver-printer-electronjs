(
    function () {
        "use strict";
        const path = require("path");
        const bodyParser = require("body-parser");
        const express = require("express");
        const cors = require("cors");
        const port = 3000;

        const app = express();
        app.use(cors());
        app.use(bodyParser.json());

        app.get("/", function (req, res) {
            res.send("Running Success!");
        });

        app.post("/printantrian", (req, res) => {
            const { printAntrian } = require("./printer");
            res.json({ status: "success" });
            let request = req.body;
            printAntrian(request.no_antrian, request.code_antrian, request.config);
        });

        let server = app.listen(port, () => {
            console.log("Express server listening on port " + server.address().port);
        });

        module.exports = app;
    }()
);
