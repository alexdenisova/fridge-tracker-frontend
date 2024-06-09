import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { getParseIngredients } from "../backend/parse_ingredients.js";
import { getParseRecipeLink } from "../backend/parse_recipe_link.js";
import { postRecipeIngredient } from "../backend/recipe_ingredients.js";
import { postRecipe } from "../backend/recipes.js";
import { clickButton, hideElement, redirectToLogin, showElement, showMessage, showMessageThenRedirect } from "../utils.js";
import { INGREDIENT_TABLE_ID, LIST_ID, main } from "./constants.js";
import { unpressFilterButton } from "./filter.js";
import { createStar, getRating } from './utils.js';

import { createTable } from "./ingredient_table.js";

const ADD_RECIPE_BUTTON_ID = "add_recipe_button";
const ADD_ID = "add_recipes_form";
const PARSED_INGREDIENTS_BUTTON_ID = "parse_ingredients_button";

window.addRecipeButton = function (add_id) {
  if (clickButton(add_id) == "unpressed") {
    hideElement(ADD_ID);
    showElement(LIST_ID);
  } else {
    hideElement(LIST_ID);
    unpressFilterButton();
    if (document.getElementById(ADD_ID) == null) {
      addForm();
    } else {
      showElement(ADD_ID, "block");
    }
  }
}

export function unpressAddRecipeButton() {
  document.getElementById(ADD_RECIPE_BUTTON_ID).style.backgroundColor = "#b4d6b4";
  if (document.getElementById(ADD_ID) != null) {
    hideElement(ADD_ID);
  }
}

function addForm() {
  const div = document.createElement("div");
  div.setAttribute("class", "form");
  div.setAttribute("id", ADD_ID);
  div.innerHTML = `
    <div class="form-heading">Provide recipe information</div>
    <form>
      <label for="recipe_name"><span>Name<span class="required">*</span></span><input type="text" class="input-field" id="recipe_name" name="recipe_name"></label>
      <label for="link"><span>Link</span><input type="text" class="input-field" id="link" name="link"></label>
      <button id="parse-link-button" class="parse" type="button" onclick="parseLink('link', 'parse-link-button')">Get Recipe from Link</button><br><br>
      <label for="ingredients"><span>Ingredients <span class="required">*</span></span><textarea id="ingredients" name="ingredients" class="textarea-field"></textarea></label>
      <button id="${PARSED_INGREDIENTS_BUTTON_ID}" class="parse" type="button" onclick="parseIngredients('parse-ingredients', '${PARSED_INGREDIENTS_BUTTON_ID}')">Parse Ingredients</button><br><br>
      <label for="prep_time_mins"><span>Prep Time (mins)</span><input type="text" class="input-field" id="prep_time_mins" name="prep_time_mins"></label>
      <label for="total_time_mins"><span>Total Time (mins)</span><input type="text" class="input-field" id="total_time_mins" name="total_time_mins"></label>
      <label for="instructions"><span>Instructions <span class="required">*</span></span><textarea id="instructions" name="instructions" class="textarea-field"></textarea></label>
      <label for="image"><span>Image Link</span><input type="text" class="input-field" id="image" name="image"></label>
      <label for="last_cooked"><span>Last Cooked</span><input type="date" class="input-field" id="last_cooked" name="last_cooked" placeholder="YYYY-MM-DD"></label>
      <label for="rating"><span>Rating</span>${createStar(0)}</label>
      <label for="notes"><span>Notes</span><textarea id="notes" name="notes" class="textarea-field"></textarea></label>
      <button type="button" onclick="submitRecipe();" value="Submit">Submit</button>
    </form>`;
  main.appendChild(div);
}

window.submitRecipe = async function () {
  const name = document.getElementById('recipe_name').value;
  const link = document.getElementById('link').value;
  const prep_time_mins = document.getElementById('prep_time_mins').value;
  const total_time_mins = document.getElementById('total_time_mins').value;
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').value;
  const last_cooked = document.getElementById('last_cooked').value;
  let rating = getRating();
  if (rating == 0) {
    rating = null;
  }
  const notes = document.getElementById('notes').value;

  const response = await postRecipe(name, prep_time_mins, total_time_mins, link, instructions, image, last_cooked, rating, notes);
  if (response.ok) {
    const data = await response.json();
    const all_ingredients_added = await postRecipeIngredients(data.id);
    if (all_ingredients_added) {
      showMessageThenRedirect("Recipe added successfully!", true, "index.html");
    } else {
      showMessageThenRedirect("Recipe added, but not all ingredients!", false, "recipe.html?id=" + data.id);
    }
  } else if (response.status == 401) {
    redirectToLogin();
  } else {
    showMessage("Failed to create recipe!", false);
  }
  return false;
}

// TODO: return list of failed creations
async function postRecipeIngredients(recipe_id) {
  const table = document.getElementById(INGREDIENT_TABLE_ID);

  let all_ingredients_added = true;
  for (var i = 0; i < table.children[1].childElementCount; i++) {
    const tr_id = table.children[1].children[i].id;
    let amount = document.getElementById(tr_id + "-0").value;
    let unit = document.getElementById(tr_id + "-1").value;
    let name = document.getElementById(tr_id + "-2").value;
    let optional = document.getElementById(tr_id + "-3").checked;
    const ingredient_id = await makeIngredientIfNotExists(name.trim());
    const response = await postRecipeIngredient(recipe_id, ingredient_id, optional, amount, unit);
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      all_ingredients_added = false;
    }
  }
  return all_ingredients_added;
}

window.parseLink = function (link_id, button_id) {
  clickButton(button_id)
  getParseRecipeLink(document.getElementById(link_id).value)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        showMessage("Could not parse link", false);
        return false;
      }
      const data = await response.json();

      document.getElementById('recipe_name').value = data.name;
      document.getElementById('prep_time_mins').value = data.prep_time_mins;
      document.getElementById('total_time_mins').value = data.total_time_mins;
      document.getElementById('instructions').value = data.instructions;
      document.getElementById('image').value = data.image;
      createIngredientsTable(data.ingredients);
      clickButton(button_id);
      return false;
    })
}

window.parseIngredients = function (input_id, button_id) {
  clickButton(button_id)
  getParseIngredients(document.getElementById(input_id).value)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        showMessage("Could not parse ingredients", false);
        return false;
      }
      const data = await response.json();
      createIngredientsTable(data.items);
      clickButton(button_id);
    });
}

function createIngredientsTable(parsed_ingredients) {
  const old_table = document.getElementById(INGREDIENT_TABLE_ID);
  if (old_table != null) {
    old_table.parentElement.removeChild(old_table);
  }

  const button = document.getElementById(PARSED_INGREDIENTS_BUTTON_ID);
  button.insertAdjacentHTML('afterend', createTable(parsed_ingredients));
}
