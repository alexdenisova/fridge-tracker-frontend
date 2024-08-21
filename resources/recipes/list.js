import { listRecipes } from "../backend/recipes.js";
import { RECIPES_PATH } from "../constants.js";
import { pagination, redirectToLogin, showMessage } from "../utils.js";
import { LIST_ID } from "./constants.js";


export function showRecipes(page, query_params = null) {
  const per_page = Math.floor(window.screen.width / 270) * 3;
  console.log("Recipes per_page: " + per_page);
  listRecipes(page, per_page, query_params)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        showMessage("Could not list recipes.", false);
        return false;
      }
      const data = await response.json();
      const recipes = document.getElementById(LIST_ID);
      recipes.innerHTML = "";
      data.items.forEach(recipe => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="recipe_column">
            <div class="recipe_card" id="${recipe.id}">
              <a href="${recipe.link}"><center><img src="${recipe.image}" class="thumbnail"></center></a>
              <p><a class="title" href="${recipe.link}">${recipe.name}</a></p>
              <p class="detail">Total time: ${recipe.total_time_mins} mins</p>
              <p class="detail"><a href="recipe.html?id=${recipe.id}" style="color:#143273">Details</a></p>
            </div>
          </div>
        `
        recipes.appendChild(div_card);
      });
      pagination(RECIPES_PATH, data._metadata.page_count, page, query_params);
    });
}
