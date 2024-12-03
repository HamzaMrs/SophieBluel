function connexion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
        alert("Veuillez entrer une adresse email valide.");
        return;
    }
    alert("Connexion réussie !");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html"; 
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', connexion);
    }
  });

document.addEventListener('DOMContentLoaded', function () {
    const loginElement = document.getElementById('login');
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        // Si l'utilisateur est connecté, remplace "login" par "log-out"
        loginElement.innerHTML = `<a href="#" id="logout">logout</a>`;
        // Ajoute un événement de déconnexion
        document.getElementById("logout").addEventListener("click", function () {
            alert("Vous êtes déconnecté.");
            localStorage.removeItem("isLoggedIn"); // Supprime l'état de connexion
            loginElement.innerHTML = `<a href="login.html" class="active">login</a>`;
        });
    }
});