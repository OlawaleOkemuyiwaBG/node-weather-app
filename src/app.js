const path = require("path");

const express = require("express");
const hbs = require("hbs");

const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000; //the port set from heroku or just port 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public"); //__dirname is an inbuilt node variable which is the directory path of the current script i.e app.js
const customViewsDirectory = path.join(__dirname, "../templates/views");
const partialsDirectory = path.join(__dirname, "../templates/partials");

//Set up static directory to serve i.e the public diretory
app.use(express.static(publicDirectoryPath));

//Setup handlebars engine to render dynamic pages(views) using templating
app.set("view engine", "hbs");
//customize the location of views directory instead of it being mandatorily in the project root directory
app.set("views", customViewsDirectory);

//Register hbs partials
hbs.registerPartials(partialsDirectory);

app.get("", (req, res) => {
  //res.send() is used to send back a regular string text, an HTML, an array/object (they are automatically converted to JSON).
  //But if we wish to render one of our views (in this instance index.hbs handlerbar template) the render method is used instead.
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
  //this is sort of our own custom RESTFUL API which internally makes use of 2 APIs to get forecast data of an address and then sends back the data as JSON just like regular APIs when an http request is sent to it (i.e when http request is sent to localhost:3000/weather?address=lagos)
  const address = req.query.address;
  if (!address) {
    res.send({
      error: "Please provide an address to forecast",
    });
    return;
  }

  const forecastData = await forecast(address);

  res.send(forecastData);
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
