//cases, deaths, recovered, todayCases

fetch("https://disease.sh/v3/covid-19/all")
  .then((response) => response.json())
  .then(({cases, deaths, recovered, todayCases}) => {
    const cases__card = document.getElementById("cases");
    const deaths__card = document.getElementById("deaths");
    const recovered__card = document.getElementById("recovered");
    const newCases__card = document.getElementById("new__cases");

    cases__card.innerHTML = cases;
    deaths__card.innerHTML = deaths;
    recovered__card.innerHTML = recovered;
    newCases__card.innerHTML = todayCases;
  });

const input = document.getElementById("country__input");
const btn = document.getElementById("search");
const card = document.getElementById("country__card");

btn.addEventListener("click", () => {
  var val = input.value;
  if (val === "") {
    alert("PLEASE ENTER A COUNTRY NAME\n");
    card.style.visibility = "hidden";
  } else {
    const url = `https://disease.sh/v3/covid-19/countries/${val}`;
    input.value = "";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Country not found or doesn't have any cases") {
          card.style.visibility = "hidden";
          alert("COUNTRY ENTERED IS INVALID");
        } else {
          card.style.visibility = "visible";
          const country__name = document.getElementById("country__name");
          const country__flag = document.getElementById("country__flag");
          const span1 = document.getElementById("span1");
          const span2 = document.getElementById("span2");
          const span3 = document.getElementById("span3");
          const span4 = document.getElementById("span4");

          span1.innerHTML = data.cases;
          span2.innerHTML = data.deaths;
          span3.innerHTML = data.recovered;
          span4.innerHTML = data.todayCases;
          country__name.innerHTML = data.country;
          country__flag.src = data.countryInfo.flag;
        }
      });
  }
});
