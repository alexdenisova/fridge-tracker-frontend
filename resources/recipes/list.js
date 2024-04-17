import { listRecipes } from "../backend/recipes.js";
import { CARDS_CLASS } from "../constants.js";
import { redirectToLogin, showMessage } from "../utils.js";
import { LIST_ID, main } from "./constants.js";

export function showRecipes(query_params = null) {
  listRecipes(query_params)
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
      const recipes = document.createElement('div');
      recipes.setAttribute("id", LIST_ID);
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
                <p class="detail"><a href="recipe.html?id=${recipe.id}" style="color:#143273">Details</a></p>
              </div>
            </div>
          </div>
        `
        recipes.appendChild(div_card);
      });
      main.appendChild(recipes);
    });
}

