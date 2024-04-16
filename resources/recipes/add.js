import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { getParseIngredients } from "../backend/parse_ingredients.js";
import { getParseRecipeLink } from "../backend/parse_recipe_link.js";
import { postRecipeIngredient } from "../backend/recipe_ingredients.js";
import { postRecipe } from "../backend/recipes.js";
import { clickButton, hideElement, redirectToLogin, showElement, showMessage } from "../utils.js";
import { RECIPES_ID, main } from "./constants.js";
import { unpressFilterButton } from "./filter.js";

import { v4 as uuidv4 } from 'uuid';

const ADD_RECIPE_BUTTON_ID = "add_recipe_button";
const ADD_RECIPE_ID = "add_recipes_form";
const PARSED_INGREDIENT_TABLE_ID = "parsed_ingredient_table";
const PARSED_INGREDIENTS_BUTTON_ID = "parse_ingredients_button";

window.addRecipeButton = function (add_id) {
  if (clickButton(add_id) == "unpressed") {
    hideElement(ADD_RECIPE_ID);
    showElement(RECIPES_ID);
  } else {
    hideElement(RECIPES_ID);
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
      showMessage("Recipe added successfully!", true);
    } else {
      showMessage("Recipe added, but not all ingredients!", false);
    }
    window.location.href = "index.html";
    return false;
  } else if (response.status == 401) {
    redirectToLogin();
    return false;
  } else {
    showMessage("Failed to create recipe!", false);
    return false;
  }
}

// TODO: return list of failed creations
async function postRecipeIngredients(recipe_id) {
  const table = document.getElementById(PARSED_INGREDIENT_TABLE_ID);

  let all_ingredients_added = true;
  for (var i = 0; i < table.childElementCount - 1; i++) {
    const tr_id = table.children[i + 1].id;
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
  console.log("button id: " + button_id);
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
      clickButton(button_id)
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
  const old_table = document.getElementById(PARSED_INGREDIENT_TABLE_ID);
  if (old_table != null) {
    old_table.parentElement.removeChild(old_table);
  }

  const table = document.createElement('table');
  table.setAttribute("id", PARSED_INGREDIENT_TABLE_ID);
  table.innerHTML = `
      <tr>
        <th>Amount</th>
        <th>Unit</th>
        <th>Ingredient</th>
        <th>Optional</th>
      </tr>`;
  const add_ingredient_button = document.createElement('button');
  add_ingredient_button.setAttribute("id", "add_ingredient_button");
  add_ingredient_button.setAttribute("type", "button");
  add_ingredient_button.innerHTML = `Add Ingredient`;
  add_ingredient_button.setAttribute("onclick", `addIngredientRow()`);

  const button = document.getElementById(PARSED_INGREDIENTS_BUTTON_ID);
  button.parentNode.insertBefore(add_ingredient_button, button.nextSibling);
  button.parentNode.insertBefore(table, button.nextSibling);
  parsed_ingredients.forEach(ingredient => {
    addIngredientRow(ingredient.amount, ingredient.unit, ingredient.name);
  });
}

window.addIngredientRow = addIngredientRow;

function addIngredientRow(amount = "", unit = "", name = "") {
  console.log(amount + unit + name);
  const table = document.getElementById(PARSED_INGREDIENT_TABLE_ID);
  const tr = document.createElement('tr');
  const tr_id = uuidv4();
  tr.setAttribute("id", tr_id);
  tr.innerHTML = `
      <td><input type="text" id="${tr_id}-0" value="${amount}"></td>
      <td><input type="text" id="${tr_id}-1" value="${unit}"></td>
      <td><input type="text" id="${tr_id}-2" value="${name}"></td>
      <td><input type="checkbox" id="${tr_id}-3"></td>
      <td><img src="http://findicons.com/files/icons/1715/gion/24/dialog_cancel.png"
      onclick='removeElement("${tr_id}")'></td>`;
  table.appendChild(tr);
  return false;
}
