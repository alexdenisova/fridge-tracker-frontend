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

    const ingredient_response = await getIngredient(data.ingredient_id);
    if (ingredient_response.status == 401) {
      redirectToLogin();
      return false;
    }
    const ingredient = await ingredient_response.json()

    let amount = "";
    const select = unitOptions();
    if (data.quantity != null) {
      amount = data.quantity;
    } else if (data.weight_grams != null) {
      amount = data.weight_grams;
      select.children[1].setAttribute("selected", "selected");
    } else if (data.volume_milli_litres != null) {
      amount = data.volume_milli_litres;
      select.children[2].setAttribute("selected", "selected");
    }
    let checked = "";
    if (data.essential == true) {
      checked = "checked=true";
    }
    const div = document.createElement("div");
    div.setAttribute("class", "form");
    div.innerHTML = `
      <div class="form-heading" id="ingredient_name">${ingredient.name}</div>
      <form id="${CHANGE_ID}">
        <label for="expiration_date"><span>Expiraton Date</span><input type="date" class="input-field" id="expiration_date" name="expiration_date" placeholder="YYYY-MM-DD" value="${data.expiration_date || ""}"></label>
        <label for="amount"><span>Amount</span><input type="text" class="input-field" id="amount" name="amount" style="width:30%;" value="${amount}">${select.outerHTML}</label>
        <label for="running_low"><span>Running low at</span><input type="text" class="input-field" id="running_low" name="running_low" style="width:30%;" value="${data.running_low || ""}"></label>
        <label for="essential"><span>Essential</span><input type="checkbox" class="input-checkbox" id="essential" ${checked}></label>
        <button type="button" id="${SAVE_ID}" onclick="savePantryItem('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
        <button type="button" id="${DELETE_ID}" onclick="removePantryItem('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>
      </form>`;
    main.appendChild(div);
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
  const amount = getOrNull(document.getElementById('amount'), "value");
  const running_low = getOrNull(document.getElementById('running_low'), "value");
  if (isNaN(amount) && amount != null || isNaN(running_low) && running_low != null) {
    showMessage("Amount must be a number or none", false);
    return false;
  }
  const unit_options = document.getElementById("unit");
  let unit = unit_options.options[unit_options.selectedIndex].text;
  let map = transformAmount(amount, unit);

  const ingredient_name = document.getElementById('ingredient_name').innerText;
  const expiration_date = getOrNull(document.getElementById('expiration_date'), "value");
  const essential = document.getElementById('essential').checked;

  const ingredient_id = await makeIngredientIfNotExists(ingredient_name);
  let new_map = new Map(Object.entries({
    ...expiration_date && { 'expiration_date': expiration_date },
    ...ingredient_id && { 'ingredient_id': ingredient_id },
    ...running_low && { 'running_low': Number(running_low) },
    'essential': essential,
  }));
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
