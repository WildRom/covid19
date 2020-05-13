// SELECT ALL ELEMENTS
const country_name_element = document.querySelector('.country .name');
const total_cases_element = document.querySelector('.total-cases .value');
const new_cases_element = document.querySelector('.total-cases .new-value');
const recovered_element = document.querySelector('.recovered .value');
const new_recovered_element = document.querySelector('.recovered .new-value');
const deaths_element = document.querySelector('.deaths .value');
const new_deaths_element = document.querySelector('.deaths .new-value');

const ctx = document.getElementById('axes_line_chart').getContext("2d");

let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [],
    dates = [];

// GET USERS COUNTRY CODE
// console.log(geoplugin_countryCode() ? geoplugin_countryCode() : 'GB');
let country_code = (geoplugin_countryCode()) ? geoplugin_countryCode() : 'GB';
let user_country;
country_list.forEach(country => {
  if(country.code === country_code) {
    user_country = country.name;
  }
})
// console.log("Welcome to our visitors from "+geoplugin_city()+", "+geoplugin_countryName());
// console.log(user_country);
//https://docs.rapidapi.com/docs/keys
//my IP: 86.181.5.60

function fetchData(user_country) {
  cases_list = [], recovered_list = [], deaths_list = [], dates = [];
  fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
      "x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
    }
  })
    .then( response => {
    return response.json();
  })
    .then( data => {
      dates = Object.keys(data);

      dates.forEach(date => {
        let DATA = data[date];
        app_data.push(DATA);
        cases_list.push(parseInt(DATA.total_cases.replace(/,/g, '')));
        recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, '')));
        deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, '')));
      })
    })
    .then( () => {
      updateUI();
    })
    .catch( error => {
      alert(error);
    })
}
fetchData(user_country);

function updateUI() {
  updateStats();
  axesLinearChart();
}

// TODO percentage

function updateStats() {
  let last_entry = app_data[app_data.length - 1];
  let before_last_entry = app_data[app_data.length - 2];
  let total = parseInt(last_entry.total_cases.replace(/,/g, ''));
  let recovered = parseInt(last_entry.total_recovered.replace(/,/g, '')) || '';
  let deaths = parseInt(last_entry.total_deaths.replace(/,/g, ''));
  let recovered_percent = (recovered && total) ? (recovered * 100 / total).toFixed(2) : '';
  let deaths_percent = (deaths && total) ? (deaths * 100 / total).toFixed(2) : '';

  country_name_element.innerHTML = last_entry.country_name;

  total_cases_element.innerHTML = last_entry.total_cases.replace(/,/g, '.') || 0;
  new_cases_element.innerHTML = `+${last_entry.new_cases || 0}`;

  recovered_element.innerHTML = (last_entry.total_recovered.replace(/,/g, '.') || 0) + ` (${recovered_percent}%)`;
  new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g, '')) - parseInt(before_last_entry.total_recovered.replace(/,/g, '')) || 0} `;

  deaths_element.innerHTML = (last_entry.total_deaths.replace(/,/g, '.') || 0) + ` (${deaths_percent}%)`;
  new_deaths_element.innerHTML = `+${last_entry.new_deaths || 0}`;
}

let my_chart;
function axesLinearChart() {
  if(my_chart) {
    my_chart.destroy();
  };
  my_chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Cases',
        data: cases_list,
        fill: false,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderWidth: 1
      },{
        label: 'Recovered',
        data: recovered_list,
        fill: false,
        borderColor: '#0f0',
        backgroundColor: '#0f0',
        borderWidth: 1
      },{
        label: 'Deaths',
        data: deaths_list,
        fill: false,
        borderColor: '#f00',
        backgroundColor: '#f00',
        borderWidth: 1
      }],
      labels: dates
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */
/*
fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=country`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	})

*/