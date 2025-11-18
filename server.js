"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const apiRoutes = require("./routes/api");

const app = express();

app.use(cors({ origin: '*' }));

// --- Helmet settings required by FCC ---
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "style-src": ["'self'"]
      }
    },
    frameguard: { action: "sameorigin" }, // Only allow iframe from same site
    dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
    referrerPolicy: { policy: "same-origin" } // Only send referrer for same site
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/public", express.static(process.cwd() + "/public"));

// Routes
apiRoutes(app);

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// 404
app.use(function (req, res) {
  return res.status(404).type("text").send("Not Found");
});

// Listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
