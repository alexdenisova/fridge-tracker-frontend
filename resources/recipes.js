import { listRecipes } from "./backend/recipes.js";
import { CARDS_CLASS } from "./constants.js";

export const RECIPES_ID = "recipes";

const main = document.getElementById("section");
const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

showRecipes()
export function showRecipes(query_params = null) {
  listRecipes(query_params)
    .then(function (data) {
      if (data == null) {
        console.log("Could not list recipes");
        return false;
      }
      const recipes = document.createElement('div');
      recipes.setAttribute("id", RECIPES_ID);
      recipes.setAttribute("class", CARDS_CLASS);
      data.items.forEach(recipe => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="recipe_column">
              <div class="recipe_card" id="${recipe.id}">
                <a href="${recipe.link}"><center><img src="${recipe.image}" class="thumbnail"></center></a>
                <p><a class="title" href="${recipe.link}">${recipe.name}</a></p>
                <p class="detail">Cooking time: ${recipe.cooking_time_mins} mins</p>
              </div>
            </div>
          </div>
        `
        recipes.appendChild(div_card);
      });
      main.appendChild(recipes);
    });
}

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    showRecipes(`name_contains=${searchItem}`);
    search.value = "";
  }
});
