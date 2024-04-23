import { getIngredient, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { deletePantryItem, getPantryItem, putPantryItem } from "../backend/pantry_items.js";
import { getOrNull, showMessage } from "../utils.js";
import { main } from "./constants.js";
import { transformAmount, unitOptions } from "./utils.js";

const CHANGE_ID = "change_pantry_item";
const SAVE_ID = "save_pantry_item";
const DELETE_ID = "delete_pantry_item";

var clicked;

export function showPantryItem(item_id) {
  getPantryItem(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessage("Could not get pantry item.", false);
      return false;
    }
    const data = await response.json();

    const select = unitOptions();
    const form = document.createElement('form');
    form.setAttribute("onsubmit", "changePantryItem('" + item_id + "'); return false;");
    form.setAttribute("id", CHANGE_ID);
    main.appendChild(form);

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
      <p class="detail">Purchase Date: <input type="text" id="edit_purchase_date" value="${data.purchase_date || ""}"></p>
      <p class="detail">Expiration Date: <input type="text" id="edit_expiration_date" value="${data.expiration_date || ""}"></p>`;
    let checked = "";
    if (ingredient.can_be_eaten_raw == true) {
      checked = "checked=true";
    }
    inner_html += `<label for="can_be_eaten_raw">Can Be Eaten Raw:</label>
      <input type="checkbox" id="edit_can_be_eaten_raw" ${checked}><br>
      <input type="submit" id="${SAVE_ID}" onclick="clickSubmit('Save');" value="Save" style="width:20%;height:100%;">
      <input type="submit" id="${DELETE_ID}" onclick="clickSubmit('Delete');" value="Delete" style="width:20%;height:100%;">`;
    document.getElementById(CHANGE_ID).innerHTML = inner_html;
  });
}

window.clickSubmit = function (name) {
  clicked = name;
}

window.changePantryItem = async function (item_id) {
  if (clicked == "Save") {
    await savePantryItem(item_id);
  } else if (clicked == "Delete") {
    await removePantryItem(item_id);
  }
}

async function removePantryItem(item_id) {
  const response = await deletePantryItem(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to delete pantry item!", false);
    return false;
  } else {
    showMessage("Pantry item deleted successfully!", true);
    window.location.href = "pantry.html";
    return false;
  }
}

async function savePantryItem(item_id) {
  const amount = getOrNull(document.getElementById('edit_amount'), "value");
  if (isNaN(amount) || amount == null) {
    showMessage("Amount must be a number", false);
    return false;
  }
  const unit_options = document.getElementById("edit_unit");
  let unit = unit_options.options[unit_options.selectedIndex].text;
  let map = transformAmount(amount, unit);

  const ingredient_name = document.getElementById('ingredient_name').innerText;
  const purchase_date = getOrNull(document.getElementById('edit_purchase_date'), "value");
  const expiration_date = getOrNull(document.getElementById('edit_expiration_date'), "value");
  const can_be_eaten_raw = document.getElementById('edit_can_be_eaten_raw').can_be_eaten_raw;

  const ingredient_id = await makeIngredientIfNotExists(ingredient_name, can_be_eaten_raw);
  let new_map = new Map(Object.entries({
    ...purchase_date && { 'purchase_date': purchase_date },
    ...expiration_date && { 'expiration_date': expiration_date },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
  }));
  map = new Map([...map, ...new_map])

  const response = await putPantryItem(item_id, map);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to save pantry item!", false);
    return false;
  } else {
    const data = await response.json();
    console.log("Saved pantry item with id ", data.id);
    showMessage("Pantry item saved successfully!", true);
    window.location.href = "pantry.html";
    return false;
  }
}
