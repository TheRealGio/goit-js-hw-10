import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchboxInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchboxInput.addEventListener(
  'input',
  debounce(searchForCountry, DEBOUNCE_DELAY)
);

function clearInterface() {
  countryInfo.replaceChildren('');
  countryList.replaceChildren('');
}

function createCountryEntry(country) {
  clearInterface();
  console.log(countryInfo);
  const div = document.createElement('div');
  div.className = 'country';
  div.innerHTML = `
        <div class="">
            <img src="${
              country.flags.svg
            }" alt="Country flag" width="55", height="55">
            <h2> ${country.name.official}</h2>
        </div>
            <p >Capital: <span>${country.capital}</span></p>
            <p>Population: <span>${country.population}</span></p>
            <p>Languages: <span>${Object.values(country.languages).join(
              ','
            )}</span></p>`;
  countryInfo.appendChild(div);
}

function createCountryList(countries) {
  clearInterface();

  const list = countries.map(country => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag Picture" width ="50" height="30"/>
        <div>${country.name.official}</div>
        </li>`;
    countryList.appendChild(li);
  });
}

function searchForCountry() {
  const inputedCountry = searchboxInput.value.trim();
  if (inputedCountry === '') {
    clearInterface();
    return;
  } else {
    fetchCountries(inputedCountry)
      .then(countryNames => {
        if (countryNames.length === 1) {
          createCountryEntry(countryNames[0]);
        } else if (countryNames.length < 10) {
          createCountryList(countryNames);
        } else {
          clearInterface();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearInterface();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}
