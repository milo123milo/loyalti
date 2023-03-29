const logoutButton = document.querySelector('#logout-button');

logoutButton.addEventListener('click', function() {
  window.location.href = '/logout';
});