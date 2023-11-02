const API_KEY = "114f7ce46dc243cb9d83daae7fe19fb8";

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector(".container form");
  const cuisineInput = document.getElementById("cuisineInput");
  const dietInput = document.getElementById("dietInput");
  const minProteinInput = document.getElementById("minProteinInput");
  const maxProteinInput = document.getElementById("maxProteinInput");
  const minCarbsInput = document.getElementById("minCarbsInput");
  const maxCarbsInput = document.getElementById("maxCarbsInput");
  const minFatsInput = document.getElementById("minFatsInput");
  const maxFatsInput = document.getElementById("maxFatsInput");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById("searchInput").value;
    fetchAPI(searchQuery);
  });

  // Advanced search functionality
  cuisineInput.addEventListener('change', runSearch);
  dietInput.addEventListener('change', runSearch);
  minProteinInput.addEventListener('change', runSearch);
  maxProteinInput.addEventListener('change', runSearch);
  minCarbsInput.addEventListener('change', runSearch);
  maxCarbsInput.addEventListener('change', runSearch);
  minFatsInput.addEventListener('change', runSearch);
  maxFatsInput.addEventListener('change', runSearch);
});

function runSearch() {
  const cuisineQuery = document.getElementById("cuisineInput").value;
  const dietQuery = document.getElementById("dietInput").value;
  const minProteinQuery = document.getElementById("minProteinInput").value;
  const maxProteinQuery = document.getElementById("maxProteinInput").value;
  const minCarbsQuery = document.getElementById("minCarbsInput").value;
  const maxCarbsQuery = document.getElementById("maxCarbsInput").value;
  const minFatsQuery = document.getElementById("minFatsInput").value;
  const maxFatsQuery = document.getElementById("maxFatsInput").value;

  fetchAPI('', cuisineQuery, dietQuery, minProteinQuery, maxProteinQuery, minCarbsQuery, maxCarbsQuery, minFatsQuery, maxFatsQuery);
}

async function fetchAPI(searchQuery, cuisineQuery, dietQuery, minProteinQuery, maxProteinQuery, minCarbsQuery, maxCarbsQuery, minFatsQuery, maxFatsQuery) {
  let baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100`;

  if (searchQuery) {
    baseURL += `&query=${searchQuery}`;
  }
  if (cuisineQuery) {
    baseURL += `&cuisine=${cuisineQuery}`;
  }
  if (dietQuery) {
    baseURL += `&diet=${dietQuery}`;
  }
  if (minProteinQuery) {
    baseURL += `&minProtein=${minProteinQuery}`;
  }
  if (maxProteinQuery) {
    baseURL += `&maxProtein=${maxProteinQuery}`;
  }
  if (minCarbsQuery) {
    baseURL += `&minCarbs=${minCarbsQuery}`;
  }
  if (maxCarbsQuery) {
    baseURL += `&maxCarbs=${maxCarbsQuery}`;
  }
  if (minFatsQuery) {
    baseURL += `&minFat=${minFatsQuery}`;
  }
  if (maxFatsQuery) {
    baseURL += `&maxFat=${maxFatsQuery}`;
  }

  try {
    const response = await fetch(baseURL);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const data = await response.json();
    generateHTML(data.results);
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function generateHTML(results) {
  let generatedHTML = '';
  results.forEach(result => {
    generatedHTML += `
      <div class="search-result">
        <div class="item">
          <img src="${result.image}" alt="img" onclick="getRecipeSource(${result.id})">
          <div class="flex-container">
            <h1 class="title">${result.title}</h1>
            <a class="view-btn" href="#" data-id="${result.id}">View Nutrients</a>
          </div>
          <p class="item-data">Protein:</p>
          <p class="item-data">Carbs:</p>
          <p class="item-data">Fat:</p>
        </div>
      </div>
    `;
  });

  document.querySelector(".search-container").innerHTML = generatedHTML;

  const viewRecipeButtons = document.querySelectorAll('.view-btn');
  viewRecipeButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const recipeId = button.getAttribute('data-id');
      const recipeNutrients = await getRecipeNutrients(recipeId);

      if (recipeNutrients) {
        const protein = recipeNutrients.protein ? recipeNutrients.protein : 'Protein Not Available';
        const carbs = recipeNutrients.carbs ? recipeNutrients.carbs : 'Carbs Not Available';
        const fat = recipeNutrients.fat ? recipeNutrients.fat : 'Fat Not Available';

        const parentDiv = button.parentElement.parentElement;
        const itemData = parentDiv.querySelectorAll('.item-data');
        itemData[0].textContent = `Protein: ${protein}`;
        itemData[1].textContent = `Carbs: ${carbs}`;
        itemData[2].textContent = `Fat: ${fat}`;
      } else {
        console.log('No nutrient data found');
      }
    });
  });
}

async function getRecipeNutrients(recipeId) {
  const nutrientURL = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`;
  try {
    const response = await fetch(nutrientURL);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe nutrient data:", error);
    return null;
  }
}

async function getRecipeSource(id) {
  const sourceUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const data = await response.json();
    const recipeLink = data.sourceUrl;
    window.open(recipeLink, "_blank");
  } catch (error) {
    console.error("Error fetching recipe source:", error);
  }
}