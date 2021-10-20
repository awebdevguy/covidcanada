
// Header information output
const headerDate = document.getElementById('header-date');
const headerProv = document.getElementById('header-prov');
const headerRegion = document.getElementById('header-region');

const dated = document.getElementById("date");

const provDropdown = document.getElementById("prov-dropdown");
const regionDropdown = document.getElementById("region-dropdown");
var provinceSelected = '';

const region = document.getElementById("region");
const newDeaths = document.getElementById("new-deaths");
const totalDeaths = document.getElementById("total-deaths");

const newCase = document.getElementById("new-case");
const activeCase = document.getElementById("active-case");
const totalCase = document.getElementById("total-case");
const newVaccine = document.getElementById("new-vaccine");
const completedVaccine = document.getElementById("completed-vaccine");
const totalAdministered = document.getElementById("total-administered");
const totalDistributed = document.getElementById("total-distributed");
const newRecovered = document.getElementById("new-recovered");
const totalRecovered = document.getElementById("total-recovered");

// const proxyURL = "https://quicors.herokuapp.com/";
const proxyURL = '';

const provincesURL =  proxyURL + "https://api.opencovid.ca/other?stat=prov";
const healthRegionsURL = proxyURL + "https://api.opencovid.ca/other?stat=hr";
const timeseriesURL = proxyURL + "https://api.opencovid.ca/timeseries";
const summaryURL = proxyURL + "https://api.opencovid.ca/summary";
const canadaSummaryURL = proxyURL + "https://api.opencovid.ca/summary?loc=canada";
const ABCentralSummaryURL = proxyURL + "https://api.opencovid.ca/summary?loc=4833";
const otherURL = proxyURL + "https://api.opencovid.ca/other";
const versionURL = proxyURL + "https://api.opencovid.ca/version";

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

    results.prov.forEach(item => {
      const { province_full, province_short } = item;

      if(province_short != 'RP') {
        let opt = document.createElement('option');
        opt.text = province_full;
        opt.value = province_short;
        provDropdown.add(opt);
      }
    });

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

    results.hr.forEach(item => {
      const { HR_UID, health_region_esri, province_short } = item;

      console.log("HR_UID: " + HR_UID);
      console.log("health_region_esri: " + health_region_esri);
      console.log("province_short: " + province_short);

      if(province_short === prov && HR_UID != 9999) {
        let opt = document.createElement('option');
        opt.text = health_region_esri;
        opt.value = HR_UID;
        regionDropdown.add(opt);
      }
    });
  } catch (err) {
    console.log("Error fetching regions data: " + err);
  }
}

// Put data on screen
function viewStats(dat) {
  let data = dat.summary;
  console.log("test: " + JSON.stringify(data));

  const { date, province, deaths, cumulative_deaths, cases, active_cases, cumulative_cases, recovered, cumulative_recovered, avaccine, cumulative_avaccine, cumulative_cvaccine, cumulative_dvaccine } = data[0];

  const dateString = new Date(convertFromStringToDate(date)).toDateString();
  console.log("date converted: " + convertFromStringToDate(date));

  headerDate.innerText = dateString;
  headerProv.innerText = province.toUpperCase();
  
  if(province === 'Canada') {
    headerRegion.innerText = 'All';
  }

  console.log("viewstate date: " + dated);
  console.log("new_deaths: " + deaths);

  dated.innerText = dateString;
  newDeaths.innerText = deaths ? deaths.toLocaleString() : 0;
  totalDeaths.innerText = cumulative_deaths ? cumulative_deaths.toLocaleString() : 0;

  newCase.innerText = cases ? cases.toLocaleString() : 0;
  activeCase.innerText = active_cases ? active_cases.toLocaleString() : "n/a";
  totalCase.innerText = cumulative_cases ? cumulative_cases.toLocaleString() : "n/a";
  newVaccine.innerText = avaccine ? avaccine.toLocaleString() : "n/a";
  completedVaccine.innerText = cumulative_cvaccine ? cumulative_cvaccine.toLocaleString() : "n/a";
  totalAdministered.innerText = cumulative_avaccine ? cumulative_avaccine.toLocaleString() : "n/a";
  totalDistributed.innerText = cumulative_dvaccine ? cumulative_dvaccine.toLocaleString() : "n/a";
  newRecovered.innerText = recovered ? recovered.toLocaleString() : "n/a";
  totalRecovered.innerText = cumulative_recovered ? cumulative_recovered.toLocaleString() : "n/a";
}

// Get province records and call function that loads region dropdown list
function getProvince(value) {
  initDropdownList(regionDropdown);
  provinceSelected = value === 'All' ? 'canada' : value;
  const url = `${proxyURL}https://api.opencovid.ca/summary?loc=${provinceSelected}`;
  loadData(url);
  console.log("url: " + url);
  loadRegionSelector(value);
  headerRegion.innerText = regionDropdown.options[0].text;
}

// Get health region
function getRegion(value) {
  let region = value === 'All' ? provinceSelected : value;
  const url = `${proxyURL}https://api.opencovid.ca/summary?loc=${region}`;
  loadData(url);
  console.log("url: " + url);
  headerRegion.innerText = regionDropdown.options[regionDropdown.selectedIndex].text;
}

// Initial loading of default option 'All' in dropdown lists
function initDropdownList(dropdown){
  dropdown.length = 0;
  let defaultOption = document.createElement('option');
  defaultOption.text = 'All';
  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;
}

function convertFromStringToDate(responseDate) {
  let datePieces = responseDate.split("-");
  return(new Date(datePieces[2], (datePieces[1]-1), datePieces[0]));
}