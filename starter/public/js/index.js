/* eslint-disable */
import { login, logout } from './login';
import { displayMap } from './leaflet';

const mapElement = document.getElementById('map');
const logInForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (logInForm)
  logInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);
