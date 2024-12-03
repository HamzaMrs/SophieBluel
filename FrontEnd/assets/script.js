async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json()
    return data
}

async function getCat() {
    const response = await fetch("http://localhost:5678/api/categories")
    const data = await response.json()
    return data
}


function genererPortfolio(Works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = "";
    
    for(let i = 0; i<Works.length; i++){
        const work = Works[i];
        const figureElem = document.createElement("figure");
        
        const imageElem = document.createElement("img");
        imageElem.src = work.imageUrl;
        imageElem.alt = work.title;
        
        const figcaptionElem = document.createElement("figcaption");
        figcaptionElem.textContent = work.title;
        
        figureElem.appendChild(imageElem);
        figureElem.appendChild(figcaptionElem);
        
        galleryElement.appendChild(figureElem);
    }
}


function ajouterFiltres() {
    const sectionPortfolio = document.getElementById("portfolio");
    const zoneFiltres = document.createElement("div");
    zoneFiltres.classList.add("filtres");

    const boutons = [
        { nom: "Tous", classe: "bouton-tous", id: 0 },
        { nom: "Objets", classe: "bouton-objets", id: 1 },
        { nom: "Appartements", classe: "bouton-appartements", id: 2 },
        { nom: "Hôtel & restaurants", classe: "bouton-hotel-res", id: 3 }
    ];
    // Créer les boutons et ajouter leur classe spécifique
    boutons.forEach(({ nom, classe, id }) => {
        const bouton = document.createElement("button");
        bouton.innerText = nom;
        bouton.classList.add(classe); // Ajoute la classe unique pour chaque bouton
        bouton.addEventListener("click", async () => {
            const works = await getWorks();
            let filteredWorks;
            if (id === 0) {
                filteredWorks = works;
            } else {
                filteredWorks = works.filter(work => work.categoryId === id);
            }
            genererPortfolio(filteredWorks);
        });
        zoneFiltres.appendChild(bouton);
    });
    sectionPortfolio.insertBefore(zoneFiltres, sectionPortfolio.querySelector(".gallery"));
}

async function init() {
    const works = await getWorks(); // Attends que getWorks récupère les données
    genererPortfolio(works); // Passe les données à genererPortfolio
    ajouterFiltres()
}
init();

document.getElementById("login").addEventListener("click", function() {
    window.open("login.html", "_blank");
});



