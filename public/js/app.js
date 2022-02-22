console.log("client-side javascript is loaded");

const form = document.querySelector(".form");
const locationParagraph = document.querySelector(".location");
const forecastParagraph = document.querySelector(".forecast");

form.addEventListener("submit", event => {
  event.preventDefault();
  locationParagraph.textContent = "";
  forecastParagraph.textContent = "";

  const location = document.querySelector(".input").value;
  if (!location || location.trim().length === 0) {
    alert("You must enter an address");
    return;
  }

  forecastParagraph.textContent = "Loading...";

  fetch(`http://localhost:3000/weather?address=${location}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      const { location, forecastMessage } = data;
      locationParagraph.textContent = location;
      forecastParagraph.textContent = forecastMessage;
    })
    .catch(error => {
      forecastParagraph.textContent = error;
    });
});
