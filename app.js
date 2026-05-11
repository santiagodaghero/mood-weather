const API_KEY = '08bab0f795b10cb20ae8549b6724571f';

let idioma = 'es';

// ── LOADING STATE ──────────────────────────────────────────
const loaderScreen  = document.getElementById('loaderScreen');
const mainContainer = document.getElementById('mainContainer');
let skeletonTimer   = null;

function mostrarLoader() {
  loaderScreen.style.display  = 'flex';
  mainContainer.style.display = 'none';
}

function mostrarSkeletons() {
  loaderScreen.style.display  = 'none';
  mainContainer.style.display = 'flex';
  mainContainer.classList.add('loading');
}

function mostrarDatos() {
  clearTimeout(skeletonTimer);
  loaderScreen.style.display  = 'none';
  mainContainer.style.display = 'flex';
  mainContainer.classList.remove('loading');
  mainContainer.classList.add('revealed');
  document.querySelector('.lang-btn').style.visibility = 'visible';
}

window.onload = () => {
  mostrarLoader();
  // Después de 2s sin respuesta, pasamos a skeletons
  skeletonTimer = setTimeout(mostrarSkeletons, 2000);
  navigator.geolocation.getCurrentPosition(obtenerClima, () => {
    mostrarSkeletons(); // Si falla la geolocación, mostramos skeletons
  });
}

function obtenerClima(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${idioma}`)
    .then(res => res.json())
    .then(data => {
      const ciudad   = data.name;
      const temp     = Math.round(data.main.temp);
      const condicion = data.weather[0].description;
      const humedad  = data.main.humidity;
      const viento   = Math.round(data.wind.speed * 3.6);
      const sensacion = Math.round(data.main.feels_like);

      // Hora actual
      const ahora   = new Date();
      const horas   = ahora.getHours().toString().padStart(2, '0');
      const minutos = ahora.getMinutes().toString().padStart(2, '0');

      // Rellenamos los datos reales en los elementos
      document.querySelector('.time').textContent     = `${horas}:${minutos}`;
      document.querySelector('.location').textContent = `📍 ${ciudad}`;
      document.querySelector('.city').innerHTML       = ciudad;
      document.querySelector('.temp').innerHTML       = temp + '°';
      document.querySelector('.cond').innerHTML       = condicion;
      document.querySelector('.icon').className       = 'icon';
      document.querySelector('.icon').textContent     = obtenerIcono(condicion);

      const cardNums = document.querySelectorAll('.card-num');
      cardNums[0].innerHTML = humedad + '%';
      cardNums[1].innerHTML = viento + ' km/h';
      cardNums[2].innerHTML = sensacion + '°';

      const cardTexts = document.querySelectorAll('.card-text');
      cardTexts[0].textContent = idioma === 'es' ? 'Humedad'  : 'Humidity';
      cardTexts[1].textContent = idioma === 'es' ? 'Viento'   : 'Wind';
      cardTexts[2].textContent = idioma === 'es' ? 'Sensación': 'Feels like';

      cambiarEstado(condicion);
      mostrarDatos(); // ← revela la UI con animación
    })
    .catch(() => mostrarSkeletons());
}

function cambiarEstado(condicion) {
  const container = document.querySelector('.container');
  const clima = condicion.toLowerCase();
  const hora  = new Date().getHours();
  const esNoche = hora >= 19 || hora < 7;

  // Limpiamos clases de estado antes de asignar
  container.classList.remove('sunny', 'cloudy', 'rainy', 'night');

  if (esNoche) {
    container.classList.add('night');
    document.querySelector('.icon').textContent = '🌙';
    document.querySelector('.cond').textContent = idioma === 'es' ? 'Noche despejada' : 'Clear night';
  } else if (clima.includes('lluvia') || clima.includes('llovizna')) {
    container.classList.add('rainy');
  } else if (clima.includes('nube') || clima.includes('nublado')) {
    container.classList.add('cloudy');
  } else if (clima.includes('claro') || clima.includes('despejado') || clima.includes('soleado')) {
    container.classList.add('sunny');
  } else {
    container.classList.add('sunny');
  }
}

function obtenerIcono(condicion) {
  const clima = condicion.toLowerCase();
  if (clima.includes('lluvia') || clima.includes('llovizna')) return '🌧️';
  if (clima.includes('nube')   || clima.includes('nublado'))  return '☁️';
  if (clima.includes('tormenta'))                              return '⛈️';
  if (clima.includes('nieve'))                                 return '❄️';
  if (clima.includes('niebla'))                                return '🌫️';
  return '☀️';
}

document.querySelector('.lang-btn').addEventListener('click', () => {
  idioma = idioma === 'es' ? 'en' : 'es';
  document.querySelector('.lang-btn').textContent = idioma === 'es' ? 'ES → EN' : 'EN → ES';
  navigator.geolocation.getCurrentPosition(obtenerClima);

  if (idioma === 'en') {
    document.querySelectorAll('.card-text')[0].textContent = 'Humidity';
    document.querySelectorAll('.card-text')[1].textContent = 'Wind';
    document.querySelectorAll('.card-text')[2].textContent = 'Feels like';
  } else {
    document.querySelectorAll('.card-text')[0].textContent = 'Humedad';
    document.querySelectorAll('.card-text')[1].textContent = 'Viento';
    document.querySelectorAll('.card-text')[2].textContent = 'Sensación';
  }
});
