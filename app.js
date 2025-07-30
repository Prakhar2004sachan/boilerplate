const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const dontenv = require("dotenv");
const Prismic = require("@prismicio/client");
const PrismicH = require("@prismicio/helpers");
dontenv.config();

const app = express();
const port = process.env.PORT || 3000;

const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.get("/", async (req, res) => {
  const api = await initApi(req);
  console.log(api);
  // const defaults = await handleRequest(api);
  // console.log(defaults);
  res.render("pages/home", {
    pageTitle: "Home Page",
    pageContent: "<p>Welcome to the Home Page!</p>",
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about", {
    pageTitle: "About Page",
    pageContent: "<p>This is the About Page.</p>",
  });
});

app.get("/collections", (req, res) => {
  res.render("pages/collections", {
    pageTitle: "Collections Page",
    pageContent: "<p>Browse our Collections!</p>",
  });
});

app.get("/details/:id", (req, res) => {
  res.render("pages/details", {
    pageTitle: `Details Page - ${req.params.id}`,
    pageContent: `<p>Details for item ${req.params.id}.</p>`,
    id: req.params.id,
  });
});

// Error handling for development
if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
}

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
