const path = require("path");

const express = require("express");
const hbs = require("hbs");

const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const customViewsDirectory = path.join(__dirname, "../templates/views");
const partialDirectory = path.join(__dirname, "../templates/partials");

//Set up static directory to serve
app.use(express.static(publicDirectoryPath));

//Setup handlebars engine and customize a path for it instead of the default root views directory
app.set("view engine", "hbs");
app.set("views", customViewsDirectory);

//Register hbs partials
hbs.registerPartials(partialDirectory);

app.get("", (req, res) => {
  //res.send() is used to send back a regular string, an HTML, an array/object(they are automatically converted to JSON).
  //But if we wish to render one of our views (index.hbs handlerbar template) in which we've configured express to use the view engine - hbs, the render method is used instead.
  res.render("index", {
    title: "Weather",
    name: "Olawale Okemuyiwa",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Oluwaseun Okemuyiwa",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "If young metro dont trust you, im gon shoot you",
    title: "Help",
    name: "Olawale Okemuyiwa",
  });
});

app.get("/weather", async (req, res) => {
  //this is sort of our own API used to send forecast data JSON back when a get request is sent to the URL (localhost:3000/weather?...)
  const address = req.query.address;
  if (!address) {
    res.send({
      error: "Please provide an address to forecast",
    });
    return;
  }

  const { location, forecastMessage } = await forecast(address);

  res.send({
    address,
    forecastMessage,
    location,
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Olawale Okemuyiwa",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Olawale Okemuyiwa",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
