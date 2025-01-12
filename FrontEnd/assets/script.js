//////////////////////////////////////////////// RECUPERATION DEPUIS L'API ///////////////////////////////////////////////////////////
// RECUPERATION DES TRAVAUX
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json();
    return data
}
// RECUPERATION DES CATEGORIES
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    const data = await response.json()
    return data
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// AFFICHAGE DES IMAGES DANS LE PORTFOLIO /////////////////////////////////////////////////
function genererPortfolio(Works) {
    const token = localStorage.getItem("token");
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = ""; // On vide tout

    for (let i = 0; i < Works.length; i++) {
        const work = Works[i];
        const figureElem = document.createElement("figure");

        const imageElem = document.createElement("img");
        imageElem.src = work.imageUrl;
        imageElem.alt = work.title;

        const figcaptionElem = document.createElement("figcaption");
        figcaptionElem.textContent = work.title;

        figureElem.appendChild(imageElem);
        figureElem.appendChild(figcaptionElem);

        if (token) {
            // Creation l'élément de la barre d'édition
            const barreEdition = document.createElement("div");
            if (!document.getElementById("barre-edition")) {
                barreEdition.id = "barre-edition";
                barreEdition.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>   Mode édition';
                document.body.insertBefore(barreEdition, document.body.firstChild);
            }
            // Ajouter la possibilité de modification
            const modifierContainer = document.getElementById("modifier-container");
            if (!modifierContainer.querySelector(".modify-text")) {
                const modifier = document.createElement("span");
                modifier.classList.add("modify-text");
                modifier.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
                modifier.addEventListener("click", () => createModal(Works)); // Ouvre le modal dès qu'on clique desssus
                modifierContainer.appendChild(modifier);
            }
        }
        galleryElement.appendChild(figureElem);
    }
}

//////////////////////////////////////////////// AJOUT DES FILTRES ///////////////////////////////////////////////////////////
async function ajouterFiltres() {
    const token = localStorage.getItem("token");
    if (token) {
        return; // Si l'utilisateur est connecté, ne pas afficher les filtres
    }
    const sectionPortfolio = document.getElementById("portfolio");
    const zoneFiltres = document.createElement("div");
    zoneFiltres.classList.add("filtres");
    try {
        // Récupérer les catégories depuis l'API
        const categories = await getCategories();
        // Ajouter une catégorie "Tous" manuellement
        const boutons = [
            { id: 0, name: "Tous", classe: "bouton-tous", active: true }, // Ajoute la propriété active ici
            ...categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                classe: `bouton-${cat.name.toLowerCase().replace(/ /g, "-")}`,
                active: false // Par défaut, les autres boutons ne sont pas actifs
            }))
        ];
        // Créer les boutons dynamiquement
        boutons.forEach(({ id, name, classe, active }) => {
            const bouton = document.createElement("button");
            bouton.innerText = name;
            bouton.classList.add(classe); // Ajoute la classe spécifique
            if (active) {
                bouton.classList.add("active"); // Ajoute la classe active au bouton "Tous"
            }
            bouton.addEventListener("click", async () => {
                const works = await getWorks();
                let filteredWorks;
                if (id === 0) {
                    filteredWorks = works; // Afficher tous les travaux
                } else {
                    filteredWorks = works.filter(work => work.categoryId === id);
                }
                genererPortfolio(filteredWorks);
                // Retirer la classe active de tous les boutons
                const allButtons = document.querySelectorAll(".filtres button");
                allButtons.forEach(btn => btn.classList.remove("active"));
                // Ajouter la classe active au bouton cliqué
                bouton.classList.add("active");
            });

            zoneFiltres.appendChild(bouton);
        });

        sectionPortfolio.insertBefore(zoneFiltres, sectionPortfolio.querySelector(".gallery"));
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

///////////// APPEL DES FONCTIONS POUR LA PAGE D'ACCEUIL ///////////////
async function init() {
    const works = await getWorks(); // Déclare et assigne works ici
    genererPortfolio(works); // Passe les données à genererPortfolio
    ajouterFiltres();
}
init();

///////////// REDIRECTION VERS LA PAGE DE LOGIN ///////////////////////
document.getElementById("login").addEventListener("click", function () {
    window.open("login.html", "_blank");
});

////////////////////////////////////////////////FONCTION POUR LE MODALE////////////////////////////////////////////////////////////////
function createModal(works) {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modal.appendChild(modalContent);

    // Ajouter le titre
    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Galerie photo";
    modalContent.appendChild(modalTitle);

    // Ajouter un bouton de fermeture
    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close");
    closeBtn.innerHTML = "&times;";
    modalContent.appendChild(closeBtn);

    // Créer la galerie d'images
    const gallery = document.createElement("div");
    gallery.classList.add("modal-gallery");
    modalContent.appendChild(gallery);

    works.forEach((work) => {
        const zoneImg = document.createElement("div");
        zoneImg.classList.add("zoneImg");
        zoneImg.dataset.id = work.id; // Ajoute l'ID de l'œuvre dans un attribut data

        // Ajouter l'image
        const imageElem = document.createElement("img");
        imageElem.src = work.imageUrl;
        imageElem.alt = work.title;
        zoneImg.appendChild(imageElem);

        // Ajouter le bouton de suppression
        const deleteBtn = document.createElement("span");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        zoneImg.appendChild(deleteBtn);

        // Ajoutez l'événement de suppression
        deleteBtn.addEventListener("click", deleteWorks)

        gallery.appendChild(zoneImg);
    });

    // Créer le bouton "Ajouter une photo"
    const addButton = document.createElement("button");
    addButton.classList.add("add-btn");
    addButton.textContent = "Ajouter une photo";
    modalContent.appendChild(addButton);

    
    
    // Créer la page pour ajouter une photo
    const addPhotoPage = document.createElement("div");
    addPhotoPage.classList.add("add-photo-page");
    addPhotoPage.style.display = "none";
    modalContent.appendChild(addPhotoPage);
    // Créer le contenu de la page "Ajouter une photo"
    const addPhotoContent = document.createElement("div");
    addPhotoContent.classList.add("modal-content");
    addPhotoPage.appendChild(addPhotoContent);
    // Créer le close
    const closeAddPhotoBtn = document.createElement("span");
    closeAddPhotoBtn.classList.add("close");
    closeAddPhotoBtn.innerHTML = "&times;"; // Symbole de fermeture
    closeAddPhotoBtn.addEventListener("click", () => {
        modal.remove(); // Ferme complètement le modal
    });
    addPhotoContent.appendChild(closeAddPhotoBtn);
    // Ajouter le titre
    const addTitle = document.createElement("h2");
    addTitle.textContent = "Ajout photo";
    addPhotoContent.appendChild(addTitle);
    //Ajouter la zone d'ajout et de saisie
    const zoneAjout = document.createElement("div");
    zoneAjout.classList.add("zone-ajout");
    addPhotoContent.appendChild(zoneAjout);
    // Creer la zone pour ajouter la photo
    const addPhotoZone = document.createElement("div");
    addPhotoZone.classList.add("add-photo-zone");
    zoneAjout.appendChild(addPhotoZone);
    // Ajouter l'icône "photo"
    const photoIcon = document.createElement("div");
    photoIcon.classList.add("photo-icon");
    photoIcon.innerHTML = '<i class="fa-regular fa-image"></i>';
    addPhotoZone.appendChild(photoIcon);
    // Ajouter un champ de fichier caché
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/png, image/jpeg");
    fileInput.style.display = "none"; // Cacher l'input
    addPhotoZone.appendChild(fileInput);
    // Ajouter le bouton pour "+ Ajouter photo"
    const addPhotoButton = document.createElement("button");
    addPhotoButton.classList.add("add-photo-btn");
    addPhotoButton.textContent = "+ Ajouter photo";
    addPhotoZone.appendChild(addPhotoButton);
    // Ajouter l'événement pour ouvrir le sélecteur de fichiers
    addPhotoButton.addEventListener("click", () => {
        fileInput.click();
    });
    // Fonction appelée après la sélection d'un fichier
    fileInput.addEventListener("change", addWorks);
    // Ajouter l'information en bas
    const infoText = document.createElement("p");
    infoText.classList.add("info-text");
    infoText.textContent = "jpg, png : 4Mo max";
    addPhotoZone.appendChild(infoText);


    // Créer le formulaire d'ajout
    const addTitleCat = document.createElement("form");
    addTitleCat.classList.add("add-title-cat");
    addTitleCat.setAttribute("action", "#");
    addTitleCat.setAttribute("method", "post");
    zoneAjout.appendChild(addTitleCat);

   
    // Affiche la photo dans la zone d'ajout au moment de la sélection de la photo
    fileInput.addEventListener("change", function () {
        event.preventDefault();
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                addPhotoZone.style.backgroundImage = `url(${e.target.result})`;
                addPhotoZone.style.backgroundColor = "#E8F1F6";
                // On cache les élements qui sont à l'interieur de la zone d'ajout (l'icon,le bouton et le texte)
                if (photoIcon) photoIcon.style.display = "none";
                if (addPhotoButton) addPhotoButton.style.display = "none";
                if (infoText) infoText.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });


    // Ajouter le champ "Titre"
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Titre";
    addTitleCat.appendChild(titleLabel);
    // Ajouter le champ de saisie pour "Titre"
    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "title");
    titleInput.setAttribute("id", "title");
    addTitleCat.appendChild(titleInput);

    // Ajouter le champ "Catégories"
    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "category");
    categoryLabel.textContent = "Catégories";
    addTitleCat.appendChild(categoryLabel);
    // Ajouter le champ de selection pour "Categories"
    const categorySelect = document.createElement("select");
    categorySelect.setAttribute("name", "category");
    categorySelect.setAttribute("id", "category");
    addTitleCat.appendChild(categorySelect);
    // Recupération de l'API pour les categories
    categorySelect.innerHTML = "";
    getCategories().then(categories => {
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    });
    categorySelect.innerHTML = '<option value=></option>';

    // Ajouter le bouton "Valider"
    const validButton = document.createElement("button");
    validButton.type = "button";
    validButton.classList.add("val-btn");
    validButton.textContent = "Valider";
    addPhotoContent.appendChild(validButton);

    // Ajouter un bouton "Retour" avec une flèche gauche
    const backButton = document.createElement("span");
    backButton.classList.add("back-btn");
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'; // Code HTML pour une flèche gauche
    backButton.addEventListener("click", () => {
        addPhotoPage.style.display = "none"; // Cache la page d'ajout de photo
        gallery.style.display = "grid";
        modalTitle.style.display = "block"; // Réaffiche le titre
    });
    addPhotoContent.appendChild(backButton);


    // Ouvre la page pour ajouter une photo
    addButton.addEventListener("click", () => {
        addPhotoPage.style.display = "block"; // Affiche la page pour ajouter une photo
        gallery.style.display = "none"; // Cache la galerie d'images
        modalTitle.style.display = "none"; // Cache le titre
    });


    // Afficher le modal
    document.body.appendChild(modal);
    modal.style.display = "block";

    // Fermer le modal en cliquant sur le bouton de fermeture
    closeBtn.addEventListener("click", () => {
        modal.remove();
    });

    // Fermer le modal si l'utilisateur clique en dehors du contenu
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}


////////////////////////////////////////////////FONCTION DE SUPPRESSION DANS MODAL ////////////////////////////////////////////////////
async function deleteWorks(event) {
    try {
        const works = await getWorks();
        const zone = event.target.closest(".zoneImg"); // Trouve le conteneur de l'image à supprimer
        if (!zone) return;
        // Trouve l'ID de l'œuvre depuis le dataset
        const id = zone.dataset.id;
        // Vérifiez que le token est disponible
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token manquant. Connectez-vous pour continuer.");
            alert("Veuillez vous reconnecter.");
            return;
        }
        // Supprime dans le backend
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression :", errorData);
            alert("Impossible de supprimer.");
            return;
        }
        // Mise à jour locale en cas de succès
        const workIndex = works.findIndex(work => work.id === parseInt(id));
        if (workIndex !== -1) {
            works.splice(workIndex, 1); // Supprime l'élément du tableau
        }
        zone.remove(); // Supprime visuellement dans le modal
        genererPortfolio(works); // Regénère le portfolio
        const modal = document.querySelector(".modal"); 
        if (modal) {modal.remove();}
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}


////////////////////////////////////////////////FONCTION D'AJOUT DANS MODAL ////////////////////////////////////////////////////////
async function addWorks(event) {
    try {
        const works = await getWorks();
        const token = localStorage.getItem("token");
        const btn = document.querySelector(".val-btn");
        const selectedFile = event.target.files[0]; // Stocke la valeur dès le début
        let isValid = false; // Variable pour sortir de la boucle

        while (!isValid) {
            // Reprend les valeurs dynamiques à chaque itération
            const title = document.getElementById("title").value;
            const category = document.getElementById("category").value;

            if (selectedFile && title && category) {
                btn.disabled = false;
                btn.classList.add("enabled");
                isValid = true; // Sort de la boucle
            } else {
                btn.disabled = true;
                btn.classList.remove("enabled");
            }
            // Pause de 100ms pour éviter un blocage complet
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        btn.addEventListener("click", async function (event) {
            event.preventDefault();

            try {
                const token = localStorage.getItem("token");
                if (!token) return alert("Token introuvable. Connectez-vous.");
                if (!selectedFile) return alert("Veuillez sélectionner un fichier."); // Sécurité supplémentaire

                const title = document.getElementById("title").value;
                const category = document.getElementById("category").value;

                if (!title) return alert("Veuillez renseigner un titre.");
                if (!category) return alert("Veuillez sélectionner une catégorie.");

                const formData = new FormData();
                formData.append("image", selectedFile);
                formData.append("title", title); // Utilisation du titre saisi
                formData.append("category", category);

                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Erreur : ${errorData.message || "Impossible d'ajouter le travail."}`);
                    return;
                }

                const newWork = await response.json();
                works.push(newWork);
                genererPortfolio(works);

                // Fermer le modal
                const modal = document.querySelector(".modal");
                if (modal) { modal.remove(); }
            } catch (error) {
                console.error("Erreur lors de l'ajout de l'œuvre :", error);
                alert("Une erreur est survenue lors de l'ajout. Veuillez réessayer.");
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'exécution de la fonction addWorks :", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
}


