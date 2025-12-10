const API_URL = 'https://www.themealdb.com/api/json/v1/1/';
const searchInput = document.getElementById('searchInput');
const recipesList = document.getElementById('recipesList');
const countryList = document.getElementById('countryList');
const countryRecipesList = document.getElementById('countryRecipesList');

// Fonction pour récupérer la liste des pays
async function getCountries() {
    const response = await fetch(`${API_URL}list.php?a=list`);
    const data = await response.json();
    displayCountries(data.meals);
}

// Fonction pour afficher les pays
function displayCountries(countries) {
    countryList.innerHTML = ''; // Vider la liste avant d'ajouter de nouveaux pays
    countries.forEach(country => {
        const countryButton = document.createElement('button');
        countryButton.classList.add('btn', 'btn-outline-primary', 'm-2');
        countryButton.innerHTML = `${country.strArea}`;
        countryButton.addEventListener('click', () => {
            fetchRecipesByCountry(country.strArea);
        });
        countryList.appendChild(countryButton);
    });
}

// Fonction pour récupérer les recettes par pays
async function fetchRecipesByCountry(country) {
    const response = await fetch(`${API_URL}filter.php?a=${country}`);
    const data = await response.json();
    displayCountryRecipes(data.meals);
}

// Fonction pour afficher les recettes par pays
function displayCountryRecipes(recipes) {
    countryRecipesList.innerHTML = ''; // Effacer les recettes précédentes
    if (recipes.length === 0) {
        countryRecipesList.innerHTML = '<p class="text-center">Aucune recette trouvée pour ce pays</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <div class="card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${recipe.strMeal}</h5>
                    <a href="javascript:void(0);" class="btn btn-primary" onclick="viewRecipeDetails(${recipe.idMeal})">Voir la recette</a>
                </div>
            </div>
        `;
        countryRecipesList.appendChild(recipeCard);
    });
}

// Fonction pour afficher les détails d'une recette
function viewRecipeDetails(id) {
    window.location.href = `recipe.html?id=${id}`;
}

// Vérifier si nous sommes sur la page des pays (pays.html)
if (window.location.pathname.includes('pays.html')) {
    getCountries();  // Appeler la fonction pour récupérer et afficher les pays
}

// Écouter les entrées de la barre de recherche sur la page d'accueil
if (searchInput) {
    searchInput.addEventListener('input', async function() {
        const query = this.value;
        if (query.length > 2) {
            const recipes = await fetchRecipes(query);
            displayRecipes(recipes);
        } else {
            recipesList.innerHTML = ''; // Vide la liste si la recherche est trop courte
        }
    });
}

// Fonction pour récupérer les recettes par nom (fonction pour la page d'accueil)
async function fetchRecipes(query) {
    const response = await fetch(`${API_URL}search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
}

// Fonction pour afficher les recettes sur la page d'accueil
function displayRecipes(recipes) {
    recipesList.innerHTML = ''; // Effacer les recettes précédentes
    if (recipes.length === 0) {
        recipesList.innerHTML = '<p class="text-center">Aucune recette trouvée</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <div class="card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${recipe.strMeal}</h5>
                    <a href="javascript:void(0);" class="btn btn-primary" onclick="viewRecipeDetails(${recipe.idMeal})">Voir la recette</a>
                </div>
            </div>
        `;
        recipesList.appendChild(recipeCard);
    });
}
