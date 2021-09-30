const state = document.getElementById("state-select");
const district = document.getElementById("district-select");
const date = document.getElementById("date");
const submit = document.getElementById("submit-btn");
const container = document.getElementById("centres");
const warning = document.getElementById("not-available-alert");

warning.style.display = "none";
container.style.display = "none";

const districtList = [];
const stateList = [];

var current_district, current_date;

getStates();

//listening for changes in the state-select
state.addEventListener("change", (e) => {
  getDistrict(e.target.value);
  warning.style.display = "none";
  container.style.display = "none";
});

//listening for changes in the district-select
district.addEventListener("change", (e) => {
  current_district = e.target.value;
  warning.style.display = "none";
  container.style.display = "none";
});

//listening for changes in the date-select
date.addEventListener("change", (e) => {
  current_date = e.target.value;
  current_date = dateFormatter(current_date);
  console.log(current_date);
  warning.style.display = "none";
  container.style.display = "none";
});

//function to make API call and get back the list of states
function getStates() {
  fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
    .then((res) => res.json())
    .then((res) => {
      for (let i = 0; i < res.states.length; ++i) {
        const element = document.createElement("option");
        element.text = res.states[i].state_name;
        element.value = res.states[i].state_id;

        state.add(element);
      }
    });
}

//function to make API call to get district list of a state
function getDistrict(id) {
  var url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      removeAllChildren(district);
      for (let i = 0; i < res.districts.length; ++i) {
        const element = document.createElement("option");
        element.text = res.districts[i].district_name;
        element.value = res.districts[i].district_id;

        district.add(element);
      }
    });
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  getVaccinationCentres();
});

//Function to remove all chilren of a node, used for clearing the district-select
function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//Date Formatter to change the date to the desired format
function dateFormatter(current_date) {
  const year = current_date.substr(0, 4);
  const month = current_date.substr(5, 2);
  const day = current_date.substr(8, 2);

  current_date = day + "-" + month + "-" + year;

  return current_date;
}

function getVaccinationCentres() {
  removeAllChildren(container);
  var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${current_district}&date=${current_date}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const data = [];
      if (res.sessions.length > 0) {
        for (const c of res.sessions) {
          if (c.available_capacity > 0) {
            data.push(c);
          }
        }
      }
      if (data.length === 0) {
        warning.style.display = "block";
      } else {
        container.style.display = "flex";
        console.log(data);
        for (const d of data) {
          console.log(d);
          const card = `
            <div class="card w-20 h-100">
                <div class="card-body">
                <h5 class="card-title">${d.name}</h5>
                <p class="card-text">Vaccine - ${d.vaccine}</p>
                <p class="card-text">Available Dose 1 shots - ${d.available_capacity_dose1}</p>
                <p class="card-text">Available Dose 2 shots - ${d.available_capacity_dose2}</p>
                </div>
            </div>`;

          container.innerHTML += card;
        }
      }
    });
}
