import { createIngredientIfNotExists } from "./backend/ingredients.js";
import { postPantryItem } from "./backend/pantry_items.js";
import { PANTRY_ITEMS_ID } from "./pantry.js";
import { hideElement, showElement, showMessage } from "./utils.js";

const ADD_PANTRY_ITEM_ID = "add_pantry_item_form";

const main = document.getElementById("section");

window.addPantryItemButton = function (add_id) {
  if (document.getElementById(add_id).style.backgroundColor == "rgb(67, 123, 120)") {
    document.getElementById(add_id).style.backgroundColor = "#b4d6b4";
    hideElement(ADD_PANTRY_ITEM_ID);
    showElement(PANTRY_ITEMS_ID);
  } else {
    document.getElementById(add_id).style.backgroundColor = "#437b78";
    hideElement(PANTRY_ITEMS_ID);
    if (document.getElementById(ADD_PANTRY_ITEM_ID) == null) {
      addForm();
    } else {
      showElement(ADD_PANTRY_ITEM_ID, "block");
    }
  }
}

function addForm() {
  const form = document.createElement("form");
  form.setAttribute("onsubmit", "submitPantryItem(); return false;");
  form.setAttribute("id", ADD_PANTRY_ITEM_ID);
  form.innerHTML = `
    <label for="ingredient_name">Ingredient Name*:</label><br>
    <input type="text" id="ingredient_name" name="ingredient_name"><br>
    <label for="purchase_date">Purchase Date:</label><br>
    <input type="text" id="purchase_date" name="purchase_date">
    <label for="expiration_date">Expiraton Date:</label><br>
    <input type="text" id="expiration_date" name="expiration_date"><br>
    <label for="quantity">Quantity:</label><br>
    <input type="text" id="quantity" name="quantity"><br>
    <label for="weight_grams">Weight (grams):</label><br>
    <input type="text" id="weight_grams" name="weight_grams"><br>
    <label for="volume_milli_litres">Volume (ml):</label><br>
    <input type="text" id="volume_milli_litres" name="volume_milli_litres"><br>
    <input type="submit" value="Submit">`
  main.appendChild(form);
}

window.submitPantryItem = async function () {
  const name = document.getElementById('ingredient_name').value;
  const purchase_date = document.getElementById('purchase_date').value;
  const expiration_date = document.getElementById('expiration_date').value;
  const quantity = document.getElementById('quantity').value;
  const weight_grams = document.getElementById('weight_grams').value;
  const volume_milli_litres = document.getElementById('volume_milli_litres').value;

  const ingredient_id = await createIngredientIfNotExists(name);
  const result = await postPantryItem(ingredient_id, purchase_date, expiration_date, quantity, weight_grams, volume_milli_litres);
  if (result != null) {
    console.log("Created pantry item with id {}", result.id);
    showMessage("Pantry item added successfully!", true);
    window.location.href = "pantry.html";
    return false;
  } else {
    showMessage("Failed to create pantry item!", false);
    return false;
  }
}
