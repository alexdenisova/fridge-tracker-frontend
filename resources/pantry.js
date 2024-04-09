import { getIngredientName } from "./backend/ingredients.js";
import { listPantryItems } from "./backend/pantry_items.js";
import { CARDS_CLASS } from "./constants.js";

export const PANTRY_ITEMS_ID = "pantry_items";

const main = document.getElementById("section");
const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

returnPantryItems()
function returnPantryItems(query_params = null) {
  listPantryItems(query_params)
    .then(function (data) {
      if (data == null) {
        console.log("Could not list pantry items");
        return false;
      }
      const pantry_items = document.createElement('div');
      pantry_items.setAttribute("id", PANTRY_ITEMS_ID);
      pantry_items.setAttribute("class", CARDS_CLASS);
      data.items.forEach(item => {
        getIngredientName(item.ingredient_id).then(ingredient => {
          let amount = "";
          if (item.quantity != null) {
            amount = item.quantity;
          } else if (item.weight_grams != null) {
            amount = item.weight_grams + "g";
          } else if (item.volume_milli_litres != null) {
            amount = item.volume_milli_litres + "ml";
          }
          let expires = item.expiration_date;
          if (expires == null) {
            expires = "-";
          }
          const div_card = document.createElement('div');
          div_card.innerHTML = `
          <div class="row">
            <div class="ingredient_column">
              <div class="ingredient_card" id="${item.id}">
                <p class="title">${ingredient}</p>
                <p class="detail">${amount}</p>
                <p class="detail">Expires: ${expires}</p>
              </div>
            </div>
          </div>
        `
          pantry_items.appendChild(div_card);
        });
      });
      main.appendChild(pantry_items);
    });
}

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    returnPantryItems(`name_contains=${searchItem}`);
    search.value = "";
  }
});
