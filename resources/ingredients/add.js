import { postIngredient } from "../backend/ingredients.js";
import { clickButton, hideElement, showElement, showMessage, showMessageThenRedirect } from "../utils.js";
import { LIST_ID, main } from "./constants.js";

export const ADD_ID = "add_ingredient_form";

window.addIngredientButton = function (add_id) {
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
  form.setAttribute("onsubmit", "submitIngredient(); return false;");
  form.setAttribute("id", ADD_ID);
  form.innerHTML = `
    <label for="ingredient_name">Ingredient Name*:</label><br>
    <input type="text" id="ingredient_name" name="ingredient_name"><br>
    <label for="can_be_eaten_raw">Can Be Eaten Raw:</label>
    <input type="checkbox" id="can_be_eaten_raw"><br>
    <input type="submit" value="Submit" style="width:50%;height:100%;">`
  main.appendChild(form);
}

window.submitIngredient = async function () {
  const name = document.getElementById('ingredient_name').value;
  const can_be_eaten_raw = document.getElementById('can_be_eaten_raw').checked;

  const response = await postIngredient(name, can_be_eaten_raw);
  if (response.ok) {
    showMessageThenRedirect("Ingredient added successfully!", true, "ingredients.html");
  } else {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to create ingredient!", false);
  }
  return false;
}
