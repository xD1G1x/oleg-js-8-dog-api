import SlimSelect from 'slim-select';
import { fetchBreeds, fetchDogByBreed } from './api.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import noImage from '../images/no_image.png';

const select = document.getElementById('breed-select');
const dogInfo = document.querySelector('.dog-info');
const spinner = document.querySelector('.spinner');
const slimSelect = new SlimSelect({
  select: select,
  settings: {
    placeholderText: 'Search breeds',
  },
});

const errorMessage = {
  title: 'Error',
  message: '❌ Oops! Something went wrong! Try reloading the page!',
  position: 'topRight',
  color: 'red',
};

function showElement(element) {
  element.style.display = 'flex';
}

function hideElement(element) {
  element.style.display = 'none';
}

function displayDogInfo(dogData) {
  const dog = dogData[0].breeds[0];
  dogInfo.innerHTML = `
    <div class="wrapper">
      <img class="dog-img" src="${dogData[0].url}" alt="Dog Image"/>
      <div>
        <h2>${dog.name}</h2>
        <article><b>Description:</b> ${dog.description}</article><br>
        <article><b>Temperament:</b> ${dog.temperament}</article><br>
        <article><b>Country:</b> ${dog.origin}</article>
        <img src="https://flagsapi.com/${dog.country_code}/shiny/64.png" onerror="src='${noImage}'" width="64px" alt="country flag"> 
      </div>
    </div>
  `;
  showElement(dogInfo);
}
async function handleBreedSelection() {
  try {
    const selectedBreedId = select.value;
    hideElement(dogInfo);
    showElement(spinner);
    const dogData = await fetchDogByBreed(selectedBreedId);
    displayDogInfo(dogData);
  } catch (error) {
    iziToast.show(errorMessage);
  } finally {
    hideElement(spinner);
  }
}

async function initializeApp() {
  try {
    const breeds = await fetchBreeds();
    const breedOptions = breeds.map(({ id, name }) => ({
      text: name,
      value: id,
    }));
    slimSelect.setData([{ placeholder: true, text: '' }, ...breedOptions]);
    select.addEventListener('change', handleBreedSelection);
  } catch (error) {
    iziToast.show(errorMessage);
  } finally {
    hideElement(spinner);
  }
}

initializeApp();

