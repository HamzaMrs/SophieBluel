async function connexion(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    // Vérification du format de l'email
    if (!emailRegex.test(email)) {
        alert("Veuillez entrer une adresse email valide.");
        return;
    }
    // Vérification des identifiants spécifiques
    if (email !== "sophie.bluel@test.tld" || password !== "S0phie") {
        alert("Identifiant ou mot de passe incorrect.");
        return;
    }
    const body = JSON.stringify({ email, password });
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body
        });
        // Vérifie si la réponse est une erreur
        if (!response.ok) {
            throw new Error("Erreur de connexion, veuillez vérifier vos identifiants.");
        }
        const data = await response.json();
        // Stockage sécurisé dans le localStorage (pas de mot de passe ni d'email)
        window.localStorage.setItem("token", data.token);
        // Redirection vers la page d'accueil
        window.location.href = "index.html";
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const loginElement = document.getElementById("login");
    const token = localStorage.getItem("token");
    // Sur la page de connexion
    if (window.location.pathname === "/login.html") {
        loginElement.innerHTML = `<a href="login.html" class="active">login</a>`; // "login" est actif ici
    }
    if (token) {
        // Si connecté (présence du token), remplace "login" par "logout"
        loginElement.innerHTML = `<a href="#" id="logout">logout</a>`;
        document.getElementById("logout").addEventListener("click", function () {
            // Déconnexion
            localStorage.removeItem("token");
            loginElement.innerHTML = `<a href="login.html" class="active">login</a>`;
            window.location.reload();
        });
    } else {
        // Si non connecté, affiche "login" sur la page d'accueil sans "active"
        if (window.location.pathname !== "/login.html") {
            loginElement.innerHTML = `<a href="login.html">login</a>`;
        }
    }
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", connexion);
    }
});

