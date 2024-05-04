import { deleteIngredient, getIngredient, patchIngredient } from "../backend/ingredients.js";
import { showMessage } from "../utils.js";
import { main } from "./constants.js";

const CHANGE_ID = "change_ingredient";
const SAVE_ID = "save_ingredient";
const DELETE_ID = "delete_ingredient";

export function showIngredient(item_id) {
  getIngredient(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessage("Could not get ingredient.", false);
      return false;
    }
    const form = document.createElement('form');
    form.setAttribute("id", CHANGE_ID);

    const ingredient = await response.json();
    let inner_html = `<p class="title" id="ingredient_name">${ingredient.name}</p>`;

    let checked = "";
    if (ingredient.can_be_eaten_raw == true) {
      checked = "checked=true";
    }
    inner_html += `<label for="can_be_eaten_raw">Can Be Eaten Raw:</label>
      <input class="checkbox" type="checkbox" id="edit_can_be_eaten_raw" ${checked}><br>
      <button type="button" id="${SAVE_ID}" onclick="saveIngredient('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
      <button type="button" id="${DELETE_ID}" onclick="removeIngredient('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>`;
    form.innerHTML = inner_html;
    main.appendChild(form);
  });
}

window.removeIngredient = async function (item_id) {
  const response = await deleteIngredient(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to delete ingredient!", false);
    return false;
  } else {
    console.log("Deleted ingredient with id {}", item_id);
    window.location.href = "ingredients.html";
    return false;
  }
}

window.saveIngredient = async function (item_id) {
  const can_be_eaten_raw = document.getElementById('edit_can_be_eaten_raw').checked;

  const response = await patchIngredient(item_id, can_be_eaten_raw);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to save ingredient!", false);
    return false;
  } else {
    showMessage("Ingredient saved successfully!", true);
    return false;
  }
}
