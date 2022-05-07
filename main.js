const headerDate = document.getElementById('header-date');
const headerProv = document.getElementById('header-prov');
const headerRegion = document.getElementById('header-region');

const dated = document.getElementById("date");

const provDropdown = document.getElementById("prov-dropdown");
const regionDropdown = document.getElementById("region-dropdown");
var provinceSelected = '';

const newDeaths = document.getElementById("new-deaths");
const totalDeaths = document.getElementById("total-deaths");

const newCase = document.getElementById("new-case");
const activeCase = document.getElementById("active-case");
const totalCase = document.getElementById("total-case");
const newHospital = document.getElementById("new-hospital");
const totalHospital = document.getElementById("total-hospital");
const newICU = document.getElementById("new-icu");
const totalICU = document.getElementById("total-icu");
const newTest = document.getElementById("new-test");
const totalTests = document.getElementById("total-tests");

// const proxyURL = "https://quicors.herokuapp.com/";
const proxyURL = '';

const provincesURL =  proxyURL + "./assets/provinces.json";
const healthRegionsURL = proxyURL + "./assets/health_regions.json";
const canadaSummaryURL = proxyURL + "https://api.opencovid.ca/summary?geo=can";
const regionsArray = [];


console.log(provincesURL);
console.log(healthRegionsURL);
console.log(canadaSummaryURL);

// Initialize dropdowns with first option of 'All'
initDropdownList(provDropdown);
initDropdownList(regionDropdown);

// Load data
loadData(canadaSummaryURL);

// load provinces dropdown list
loadProvSelector(provincesURL);

async function loadProvSelector(url) {
  try {
    const res = await fetch(url);
    console.log("res status: " + res.status + " " + res.statusText);
    const results = await res.json() ;
    console.log("results: " + JSON.stringify(results));

    results.forEach(item => {
      const { region, name_canonical } = item;

      regionsArray.push(region);

      if(region != 'RP') {
        let opt = document.createElement('option');
        opt.text = name_canonical;
        opt.value = region;
        provDropdown.add(opt);
      }
    });

    console.log(regionsArray);

  } catch (err) {
    console.log("Error fetching provinces for selector: " + err);
  }
}

// Load using fetch
async function loadData(URLString) {
  try {
    const res = await fetch(URLString);
    console.log("res status: " + res.status + " " + res.statusText);
    const results = await res.json() ;
    console.log("results: " + JSON.stringify(results));

    viewStats(results);

  } catch (err) {
    console.log("Error fetching covid data: " + err);
  }
}

// Load region dropdown list
// Load using fetch
async function loadRegionSelector(prov) {

  try {
    const res = await fetch(healthRegionsURL);
    console.log("res status: " + res.status + " " + res.statusText);
    const results = await res.json() ;
    console.log("results: " + JSON.stringify(results));

    results.forEach(item => {
      const { hruid, name_canonical, region } = item;

      console.log("hruid: " + hruid);
      console.log("name_canonical: " + name_canonical);
      console.log("region: " + region);

      if(region === prov && hruid != 9999) {
        let opt = document.createElement('option');
        opt.text = name_canonical;
        opt.value = hruid;
        regionDropdown.add(opt);
      }
    });
  } catch (err) {
    console.log("Error fetching regions data: " + err);
  }
}

// Put data on screen
function viewStats(dat) {

  const { date, region, deaths_daily, deaths, cases_daily, cases, hospitalizations_daily, hospitalizations, icu_daily, icu, tests_completed_daily, tests_completed } = dat.data[0];
  
  console.log(date);
  console.log(region);

  headerDate.innerText = date;
  headerProv.innerText = region === 'CAN' ? 'CANADA' : region.toUpperCase();
  
  if(regionsArray.indexOf(region) === -1) {
    headerRegion.innerText = 'All';
  }

  console.log("viewstate date: " + dated);
  console.log("new_deaths: " + deaths_daily);

  const na = "n/a"

  dated.innerText = date;
  newDeaths.innerText = deaths_daily ? deaths_daily.toLocaleString() : na;
  totalDeaths.innerText = deaths ? deaths.toLocaleString() : 0;

  newCase.innerText = cases_daily ? cases_daily.toLocaleString() : na;
  totalCase.innerText = cases ? cases.toLocaleString() : na;
  newHospital.innerText = hospitalizations_daily ? hospitalizations_daily.toLocaleString() : na;
  totalHospital.innerText = hospitalizations ? hospitalizations.toLocaleString() : na;
  newICU.innerText = icu_daily ? icu_daily.toLocaleString() : na;
  totalICU.innerText = icu ? icu.toLocaleString() : na;
  newTest.innerText = tests_completed_daily ? tests_completed_daily.toLocaleString() : na;
  totalTests.innerText = tests_completed ? tests_completed.toLocaleString() : na;
}

// Get province records and call function that loads region dropdown list
function getProvince(value) {
  initDropdownList(regionDropdown);
  provinceSelected = value === 'All' ? 'canada' : value;
  let url;

  if(provinceSelected === 'canada') {
    url = `${proxyURL}https://api.opencovid.ca/summary?geo=can`;
  } else {
    url = `${proxyURL}https://api.opencovid.ca/summary?loc=${provinceSelected}&pt_names=canonical&hr_names=canonical`;
  }

  loadData(url);
  loadRegionSelector(value);
  headerRegion.innerText = regionDropdown.options[0].text;
}

// Get health region
function getRegion(value) {
  let region = value === 'All' ? 'all' : value;
  let url;

  if(region === 'all') {
    url = `${proxyURL}https://api.opencovid.ca/summary?geo=pt&pt_names=canonical&hr_names=canonical`;
  } else {
    url = `${proxyURL}https://api.opencovid.ca/summary?geo=hr&loc=${region}&pt_names=canonical&hr_names=canonical`;
  }

  loadData(url);
  headerRegion.innerText = regionDropdown.options[regionDropdown.selectedIndex].text;
}

// Initial loading of default option 'All' in dropdown lists
function initDropdownList(dropdown) {
  dropdown.length = 0;
  let defaultOption = document.createElement('option');
  defaultOption.text = 'All';
  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;
}

// function convertFromStringToDate(responseDate) {
//   let datePieces = responseDate.split("-");
//   return(new Date(datePieces[2], (datePieces[1]-1), datePieces[0]));
// }