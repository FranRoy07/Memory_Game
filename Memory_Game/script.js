function redirigir(pagina) {
  window.location.href = pagina;
}

function transicionRedirigir(url) {
  const fade = document.getElementById('fade');
  fade.classList.add('activo');
  setTimeout(() => {
    window.location.href = url;
  }, 700);
}