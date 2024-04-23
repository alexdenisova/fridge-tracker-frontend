import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { postPantryItem } from "../backend/pantry_items.js";
import { clickButton, getOrNull, hideElement, showElement, showMessage } from "../utils.js";
import { LIST_ID, main } from "./constants.js";
import { transformAmount, unitOptions } from "./utils.js";

export const ADD_ID = "add_pantry_item_form";

window.addPantryItemButton = function (add_id) {
  if (clickButton(add_id) == "unpressed") {
    hideElement(ADD_ID);
    showElement(LIST_ID);
  } else {
    hideElement(LIST_ID);
    if (document.getElementById(ADD_ID) == null) {
      addForm();
    } else {
      showElement(ADD_ID, "block");
    }
  }
}

function addForm() {
  const form = document.createElement("form");
  form.setAttribute("onsubmit", "submitPantryItem(); return false;");
  form.setAttribute("id", ADD_ID);
  const select = unitOptions();
  form.innerHTML = `
    <label for="ingredient_name">Ingredient Name*:</label><br>
    <input type="text" id="ingredient_name" name="ingredient_name"><br>
    <label for="purchase_date">Purchase Date:</label><br>
    <input type="text" id="purchase_date" name="purchase_date"><br>
    <label for="expiration_date">Expiraton Date:</label><br>
    <input type="text" id="expiration_date" name="expiration_date"><br>
    <label for="amount">Amount: </label><br>
    <input type="text" id="amount" name="amount"> ${select.outerHTML}<br>
    <label for="can_be_eaten_raw">Can Be Eaten Raw:</label>
    <input type="checkbox" id="can_be_eaten_raw"><br>
    <input type="submit" value="Submit" style="width:50%;height:100%;">`
  main.appendChild(form);
}

window.submitPantryItem = async function () {
  const name = document.getElementById('ingredient_name').value;
  const purchase_date = document.getElementById('purchase_date').value;
  const expiration_date = document.getElementById('expiration_date').value;
  const can_be_eaten_raw = document.getElementById('can_be_eaten_raw').checked;

  const amount = getOrNull(document.getElementById('amount'), "value");
  if (isNaN(amount) || amount == null) {
    showMessage("Amount must be a number", false);
    return false;
  }
  const unit_options = document.getElementById("edit_unit");
  let unit = unit_options.options[unit_options.selectedIndex].text;
  let map = transformAmount(amount, unit);

  const ingredient_id = await makeIngredientIfNotExists(name, can_be_eaten_raw);
  let new_map = new Map(Object.entries({
    ...purchase_date && { 'purchase_date': purchase_date },
    ...expiration_date && { 'expiration_date': expiration_date },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
  }));
  map = new Map([...map, ...new_map])

  const response = await postPantryItem(map);
  if (response.ok) {
    const result = await response.json();
    console.log("Created pantry item with id {}", result.id);
    window.location.href = "pantry.html";
    return false;
  } else {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to create pantry item!", false);
    return false;
  }
}
