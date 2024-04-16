import { getIngredient, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { getPantryItem, putPantryItem } from "../backend/pantry_items.js";
import { getOrNull, hideElement, showMessage } from "../utils.js";
import { LIST_ID, UNIT_OPTIONS, main } from "./constants.js";

const CHANGE_ID = "change_pantry_item";
const SAVE_ID = "save_pantry_item";
const DELETE_ID = "delete_pantry_item";

var clicked;

window.showPantryItem = function (item_id) {
  hideElement(LIST_ID);
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
    const select = document.createElement('select');
    select.setAttribute("id", "edit_unit");
    for (let i = 0; i < UNIT_OPTIONS.length; i++) {
      const opt = document.createElement('option');
      opt.value = UNIT_OPTIONS[i];
      opt.innerHTML = UNIT_OPTIONS[i];
      select.appendChild(opt);
    }

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
    } else if (data.volume_milli_litres != null) {
      amount = data.volume_milli_litres;
    }
    inner_html += `<p class="detail">Amount: <input type="text" id="edit_amount" value="${amount}"> ${select.outerHTML}</p>`;
    if (data.purchase_date != null) {
      inner_html += `<p class="detail">Purchase Date: <input type="text" id="edit_purchase_date" value="${data.purchase_date}"></p>`;
    } else {
      inner_html += `<p class="detail">Purchase Date: <input type="text" id="edit_purchase_date" value="-"></p>`;
    }
    if (data.expiration_date != null) {
      inner_html += `<p class="detail">Expiration Date: <input type="text" id="edit_expiration_date" value="${data.expiration_date}"></p>`;
    } else {
      inner_html += `<p class="detail">Expiration Date: <input type="text" id="edit_expiration_date" value="-"></p>`;
    }
    let checked = "";
    if (ingredient.can_be_eaten_raw == true) {
      checked = "checked=true";
    }
    inner_html += `<label for="can_be_eaten_raw">Can Be Eaten Raw:</label>
    <input type="checkbox" id="edit_can_be_eaten_raw" ${checked}><br>`;
    inner_html += `<input type="submit" id="${SAVE_ID}" onclick="clickSubmit('Save');" value="Save" style="width:20%;height:100%;">
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

  map = new Map([...map, {
    ...purchase_date && { 'purchase_date': purchase_date },
    ...expiration_date && { 'expiration_date': expiration_date },
    ...can_be_eaten_raw && { 'can_be_eaten_raw': can_be_eaten_raw },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
  }])
  const response = await putPantryItem(item_id, ingredient_id, purchase_date, expiration_date, quantity, weight_grams, volume_milli_litres);
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
