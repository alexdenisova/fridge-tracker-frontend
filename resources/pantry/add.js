import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { postPantryItem } from "../backend/pantry_items.js";
import { clickButton, getOrNull, hideElement, showElement, showMessage, showMessageThenRedirect } from "../utils.js";
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
    <label for="running_low">Running low at: </label><br>
    <input type="text" id="running_low" name="running_low"><br>
    <label for="essential">Essential:</label>
    <input type="checkbox" id="essential"><br>
    <input type="submit" value="Submit" style="width:50%;height:100%;">`
  main.appendChild(form);
}

window.submitPantryItem = async function () {
  const name = document.getElementById('ingredient_name').value;
  const purchase_date = document.getElementById('purchase_date').value;
  const expiration_date = document.getElementById('expiration_date').value;
  const essential = document.getElementById('essential').checked;

  const amount = getOrNull(document.getElementById('amount'), "value");
  const running_low = getOrNull(document.getElementById('running_low'), "value");
  if (isNaN(amount) && amount != null || isNaN(running_low) && running_low != null) {
    showMessage("Amount must be a number or none", false);
    return false;
  }
  const unit_options = document.getElementById("edit_unit");
  let unit = unit_options.options[unit_options.selectedIndex].text;
  let map = transformAmount(amount, unit);

  const ingredient_id = await makeIngredientIfNotExists(name);
  let new_map = new Map(Object.entries({
    ...purchase_date && { 'purchase_date': purchase_date },
    ...expiration_date && { 'expiration_date': expiration_date },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
    ...running_low && { 'running_low': Number(running_low) },
    'essential': essential,
  }));
  map = new Map([...map, ...new_map])

  const response = await postPantryItem(map);
  if (response.ok) {
    showMessageThenRedirect("Pantry item added successfully!", true, "pantry.html");
  } else {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to create pantry item!", false);
  }
  return false;
}
