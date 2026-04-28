const API_KEY = '08bab0f795b10cb20ae8549b6724571f';

let idioma = 'es';

window.onload = () => {
  navigator.geolocation.getCurrentPosition(obtenerClima);
}

function obtenerClima(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${idioma}`)
    .then(res => res.json())
    .then(data => {
      const ciudad = data.name;
      const temp = Math.round(data.main.temp);
      const condicion = data.weather[0].description;
      const humedad = data.main.humidity;
      const viento = Math.round(data.wind.speed * 3.6);
      const sensacion = Math.round(data.main.feels_like);

      // Hora actual
      const ahora = new Date();
      const horas = ahora.getHours().toString().padStart(2, '0');
      const minutos = ahora.getMinutes().toString().padStart(2, '0');

      // Actualizamos el HTML
      document.querySelector('.time').textContent = `${horas}:${minutos}`;
      document.querySelector('.location').textContent = `📍 ${ciudad}`;
      document.querySelector('.city').textContent = ciudad;
      document.querySelector('.temp').textContent = temp + '°';
      document.querySelector('.cond').textContent = condicion;
      document.querySelector('.icon').textContent = obtenerIcono(condicion);

      const cardNums = document.querySelectorAll('.card-num');
      cardNums[0].textContent = humedad + '%';
      cardNums[1].textContent = viento + ' km/h';
      cardNums[2].textContent = sensacion + '°';

      cambiarEstado(condicion);
    })
}

function cambiarEstado(condicion) {
  const container = document.querySelector('.container');
  const clima = condicion.toLowerCase();
  const hora = new Date().getHours();
  const esNoche = hora >= 19 || hora < 7;

  if (esNoche) {
    container.className = 'container night';
  } else if (clima.includes('lluvia') || clima.includes('llovizna')) {
    container.className = 'container rainy';
  } else if (clima.includes('nube') || clima.includes('nublado')) {
    container.className = 'container cloudy';
  } else if (clima.includes('claro') || clima.includes('despejado') || clima.includes('soleado')) {
    container.className = 'container sunny';
  } else {
    container.className = 'container sunny';
  }
}

function obtenerIcono(condicion) {
  const clima = condicion.toLowerCase();
  if (clima.includes('lluvia') || clima.includes('llovizna')) return '🌧️';
  if (clima.includes('nube') || clima.includes('nublado')) return '☁️';
  if (clima.includes('tormenta')) return '⛈️';
  if (clima.includes('nieve')) return '❄️';
  if (clima.includes('niebla')) return '🌫️';
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