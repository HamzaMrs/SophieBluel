async function connexion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
        alert("Veuillez entrer une adresse email valide.");
        return;
    }
    const body = JSON.stringify({
        email: email,
        password: password
    });
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
    })
    const data = await response.json();
    window.localStorage.setItem("authToken", data.token);

    window.localStorage.setItem("authToken", data.token); // Stock le token
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("password", password);
    // On est connecté
    window.localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html"; 
}

document.addEventListener('DOMContentLoaded', function () {
    const loginElement = document.getElementById('login');
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        // Si l'utilisateur est connecté, remplace "login" par "logout"
        loginElement.innerHTML = `<a href="#" id="logout">logout</a>`;
        // Ajoute un événement de déconnexion
        document.getElementById("logout").addEventListener("click", function () {
            // On est deconnecté
            localStorage.removeItem("authToken"); 
            localStorage.removeItem("email");       
            localStorage.removeItem("password"); 
            localStorage.removeItem("isLoggedIn"); 
            loginElement.innerHTML = `<a href="login.html" class="active">login</a>`;
            window.location.reload();
        });
    }else {
        // Si l'utilisateur n'est pas connecté, affiche le lien de login
        loginElement.innerHTML = `<a href="login.html" class="active">login</a>`;
    }
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', connexion);
    }
});