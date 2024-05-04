import { getIngredient, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { deletePantryItem, getPantryItem, putPantryItem } from "../backend/pantry_items.js";
import { getOrNull, showMessage, showMessageThenRedirect } from "../utils.js";
import { main } from "./constants.js";
import { transformAmount, unitOptions } from "./utils.js";

const CHANGE_ID = "change_pantry_item";
const SAVE_ID = "save_pantry_item";
const DELETE_ID = "delete_pantry_item";

export function showPantryItem(item_id) {
  getPantryItem(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessageThenRedirect("Could not get pantry item.", false, "pantry.html");
      return false;
    }
    const data = await response.json();

    const select = unitOptions();
    const form = document.createElement('form');
    form.setAttribute("id", CHANGE_ID);


    const ingredient_response = await getIngredient(data.ingredient_id);
    if (ingredient_response.status == 401) {
      redirectToLogin();
      return false;
    }
    const ingredient = await ingredient_response.json();

    let inner_html = `<p class="title" id="ingredient_name">${ingredient.name}</p>`;
    let amount = "";
    if (data.quantity != null) {
      amount = data.quantity;
    } else if (data.weight_grams != null) {
      amount = data.weight_grams;
      select.children[1].setAttribute("selected", "selected");
    } else if (data.volume_milli_litres != null) {
      amount = data.volume_milli_litres;
      select.children[2].setAttribute("selected", "selected");
    }
    inner_html += `
      <p class="detail">Amount: <input type="text" id="edit_amount" value="${amount}"> ${select.outerHTML}</p>
      <p class="detail">Running low at: <input type="text" id="edit_running_low" value="${data.running_low || ""}"></p>
      <p class="detail">Purchase Date: <input type="text" id="edit_purchase_date" value="${data.purchase_date || ""}"></p>
      <p class="detail">Expiration Date: <input type="text" id="edit_expiration_date" value="${data.expiration_date || ""}"></p>`;
    let checked = "";
    if (data.essential == true) {
      checked = "checked=true";
    }
    inner_html += `<label for="essential">Essential:</label>
      <input type="checkbox" id="edit_essential" ${checked}><br>
      <button type="button" id="${SAVE_ID}" onclick="savePantryItem('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
      <button type="button" id="${DELETE_ID}" onclick="removePantryItem('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>`;
    form.innerHTML = inner_html;
    main.appendChild(form);
  });
}

window.removePantryItem = async function (item_id) {
  const response = await deletePantryItem(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to delete pantry item!", false);
  } else {
    showMessageThenRedirect("Successfully deleted pantry item.", true, "pantry.html");
  }
  return false;
}

window.savePantryItem = async function (item_id) {
  const amount = getOrNull(document.getElementById('edit_amount'), "value");
  const running_low = getOrNull(document.getElementById('edit_running_low'), "value");
  if (isNaN(amount) || amount == null && isNaN(running_low) || running_low == null) {
    showMessage("Amount must be a number or none", false);
    return false;
  }
  const unit_options = document.getElementById("edit_unit");
  let unit = unit_options.options[unit_options.selectedIndex].text;
  let map = transformAmount(amount, unit);

  const ingredient_name = document.getElementById('ingredient_name').innerText;
  const purchase_date = getOrNull(document.getElementById('edit_purchase_date'), "value");
  const expiration_date = getOrNull(document.getElementById('edit_expiration_date'), "value");
  const essential = document.getElementById('edit_essential').checked;

  const ingredient_id = await makeIngredientIfNotExists(ingredient_name);
  let new_map = new Map(Object.entries({
    ...purchase_date && { 'purchase_date': purchase_date },
    ...expiration_date && { 'expiration_date': expiration_date },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
    ...running_low && { 'running_low': Number(running_low) },
    'essential': essential,
  }));
  console.log(new_map);
  map = new Map([...map, ...new_map])

  const response = await putPantryItem(item_id, map);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to save pantry item!", false);
  } else {
    showMessageThenRedirect("Successfully saved pantry item!", true, "pantry.html");
  }
  return false;
}
