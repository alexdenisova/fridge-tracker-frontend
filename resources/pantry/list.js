import { getIngredientName } from "../backend/ingredients.js";
import { listPantryItems } from "../backend/pantry_items.js";
import { PANTRY_PATH } from "../constants.js";
import { pagination, redirectToLogin, showMessage } from "../utils.js";
import { LIST_ID } from "./constants.js";
import { daysLeft, expirationDate } from "./utils.js";

export function showPantryItems(page, query_params = null) {
  const per_page = Math.floor(window.screen.width / 170) * 4;
  console.log("Pantry items per_page: " + per_page);
  listPantryItems(page, per_page, query_params)
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
      const pantry_items = document.getElementById(LIST_ID);
      pantry_items.innerHTML = "";
      for (const item of data.items) {
        const ingredient_name = await getIngredientName(item.ingredient_id);
        let amount = "-";
        let unit = "";
        if (item.quantity != null) {
          amount = item.quantity;
        } else if (item.weight_grams != null) {
          amount = item.weight_grams;
          unit = "g";
        } else if (item.volume_milli_litres != null) {
          amount = item.volume_milli_litres;
          unit = "ml";
        }
        let expires = expirationDate(item.expiration_date);
        let color = "";
        let running_low = false;
        if (!isNaN(amount) && !isNaN(item.running_low) && Number(amount) <= Number(item.running_low)) {
          running_low = true;
          color = 'style="background-color:	#ffce0b;padding-left: 4px;"';
        }
        if (item.expiration_date != null) {
          const days_left = daysLeft(item.expiration_date);
          if (days_left < 7 && days_left > 0) {
            color = 'style="background-color:	#f8ac30;"';
          } else if (days_left <= 0) {
            color = 'style="background-color:	#eb5c3f;"';
          }
        }
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="ingredient_column">
              <a href="pantry_item.html?id=${item.id}" style="text-decoration:none;color:black;">
                <div class="ingredient_card" id="${item.id}" ${color}>
                  <p class="title">${ingredient_name}</p>
                  <p class="detail">${amount}${unit}${running_low ? " - RUNNING LOW" : ""}</p>
                  <p class="detail">Expires: ${expires}</p>
                </div>
              </a>
            </div>
          </div>
        `
        pantry_items.appendChild(div_card);
      }
      pagination(PANTRY_PATH, data._metadata.page_count, page);
    });
}
