import { listIngredients } from "../backend/ingredients.js";
import { CARDS_CLASS } from "../constants.js";
import { redirectToLogin, showMessage } from "../utils.js";
import { LIST_ID, main } from "./constants.js";

export function showIngredients(query_params = null) {
  listIngredients(query_params)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        showMessage("Could not list ingredients :(.", false);
        return false;
      }
      const data = await response.json();
      const ingredients = document.createElement('div');
      ingredients.setAttribute("id", LIST_ID);
      ingredients.setAttribute("class", CARDS_CLASS);
      for (const item of data.items) {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="ingredient_column">
              <a href="ingredient.html?id=${item.id}" style="text-decoration:none;color:black;">
                <div class="ingredient_card" id="${item.id}">
                  <p class="title">${item.name}</p>
                </div>
              </a>
            </div>
          </div>
        `
        ingredients.appendChild(div_card);
      }
      main.appendChild(ingredients);
    });
}
