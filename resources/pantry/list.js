import { getIngredientName } from "../backend/ingredients.js";
import { listPantryItems } from "../backend/pantry_items.js";
import { CARDS_CLASS } from "../constants.js";
import { redirectToLogin, showMessage } from "../utils.js";
import { LIST_ID, main } from "./constants.js";
import { expirationDate } from "./utils.js";

export function showPantryItems(query_params = null) {
  listPantryItems(query_params)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        showMessage("Could not list pantry items.", false);
        return false;
      }
      const data = await response.json();
      const pantry_items = document.createElement('div');
      pantry_items.setAttribute("id", LIST_ID);
      pantry_items.setAttribute("class", CARDS_CLASS);
      for (const item of data.items) {
        const ingredient_name = await getIngredientName(item.ingredient_id);
        let amount = "-";
        if (item.quantity != null) {
          amount = item.quantity;
        } else if (item.weight_grams != null) {
          amount = item.weight_grams + "g";
        } else if (item.volume_milli_litres != null) {
          amount = item.volume_milli_litres + "ml";
        }
        let expires = expirationDate(item.expiration_date);
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="ingredient_column">
              <a href="pantry_item.html?id=${item.id}" style="text-decoration:none;color:black;">
                <div class="ingredient_card" id="${item.id}">
                  <p class="title">${ingredient_name}</p>
                  <p class="detail">${amount}</p>
                  <p class="detail">Expires: ${expires}</p>
                </div>
              </a>
            </div>
          </div>
        `
        pantry_items.appendChild(div_card);
      }
      main.appendChild(pantry_items);
    });
}
