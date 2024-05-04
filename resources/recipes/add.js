import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { getParseIngredients } from "../backend/parse_ingredients.js";
import { getParseRecipeLink } from "../backend/parse_recipe_link.js";
import { postRecipeIngredient } from "../backend/recipe_ingredients.js";
import { postRecipe } from "../backend/recipes.js";
import { clickButton, hideElement, redirectToLogin, showElement, showMessage, showMessageThenRedirect } from "../utils.js";
import { INGREDIENT_TABLE_ID, LIST_ID, main } from "./constants.js";
import { unpressFilterButton } from "./filter.js";

import { createTable } from "./ingredient_table.js";

const ADD_RECIPE_BUTTON_ID = "add_recipe_button";
const ADD_RECIPE_ID = "add_recipes_form";
const PARSED_INGREDIENTS_BUTTON_ID = "parse_ingredients_button";

window.addRecipeButton = function (add_id) {
  if (clickButton(add_id) == "unpressed") {
    hideElement(ADD_RECIPE_ID);
    showElement(LIST_ID);
  } else {
    hideElement(LIST_ID);
    unpressFilterButton();
    if (document.getElementById(ADD_RECIPE_ID) == null) {
      addForm();
    } else {
      showElement(ADD_RECIPE_ID, "block");
    }
  }
}

export function unpressAddRecipeButton() {
  document.getElementById(ADD_RECIPE_BUTTON_ID).style.backgroundColor = "#b4d6b4";
  if (document.getElementById(ADD_RECIPE_ID) != null) {
    hideElement(ADD_RECIPE_ID);
  }
}

function addForm() {
  const form = document.createElement("form");
  form.setAttribute("onsubmit", "submitRecipe(); return false;");
  form.setAttribute("id", ADD_RECIPE_ID);
  form.innerHTML = `
    <label for="recipe_name">Name*:</label>
    <input type="text" id="recipe_name" name="recipe_name"><br>
    <label for="link">Link:</label>
    <input type="text" id="link" name="link">
    <button id="parse-link-button" type="button" onclick="parseLink('link', 'parse-link-button')">Get Recipe from Link</button><br><br>
    <label for="ingredients">Ingredients:</label><br>
    <textarea id="parse-ingredients" name="ingredients"></textarea>
    <button id="${PARSED_INGREDIENTS_BUTTON_ID}" type="button" onclick="parseIngredients('parse-ingredients', '${PARSED_INGREDIENTS_BUTTON_ID}')">Parse Ingredients</button><br><br>
    <label for="cooking_time_mins">Cooking Time:<input type="text" id="cooking_time_mins" name="cooking_time_mins">mins</label><br>
    <label for="instructions">Instructions:</label><br>
    <textarea id="instructions" name="instructions"></textarea><br>
    <label for="image">Image Link:</label>
    <input type="text" id="image" name="image"><br>
    <input type="submit" value="Submit" style="width:50%;height:100%;">`
  main.appendChild(form);
}

window.submitRecipe = async function () {
  const name = document.getElementById('recipe_name').value;
  const link = document.getElementById('link').value;
  const cooking_time_mins = document.getElementById('cooking_time_mins').value;
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').value;

  const response = await postRecipe(name, cooking_time_mins, link, instructions, image);
  if (response.ok) {
    const data = await response.json();
    console.log("Created recipe with id {}", data.id);
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
  for (var i = 0; i < table.children[1].childElementCount - 1; i++) {
    const tr_id = table.children[1].children[i].id;
    let amount = document.getElementById(tr_id + "-0").value;
    let unit = document.getElementById(tr_id + "-1").value;
    let name = document.getElementById(tr_id + "-2").value;
    let optional = document.getElementById(tr_id + "-3").checked;
    const ingredient_id = await makeIngredientIfNotExists(name);
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
      document.getElementById('cooking_time_mins').value = data.cooking_time_mins;
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
