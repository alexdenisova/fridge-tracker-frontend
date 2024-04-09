import { createIngredientIfNotExists } from "./backend/ingredients.js";
import { getParseIngredients } from "./backend/parse_ingredients.js";
import { getParseRecipeLink } from "./backend/parse_recipe_link.js.js";
import { postRecipeIngredient } from "./backend/recipe_ingredients.js";
import { postRecipe } from "./backend/recipes.js";
import { unpressFilterButton } from "./filter_recipes.js";
import { RECIPES_ID } from "./recipes.js";
import { hideElement, showElement, showMessage } from "./utils.js";

import { v4 as uuidv4 } from 'uuid';

const ADD_RECIPE_BUTTON_ID = "add_recipe_button";
const ADD_RECIPE_ID = "add_recipes_form";
const PARSED_INGREDIENT_TABLE_ID = "parsed_ingredient_table";

const main = document.getElementById("section");

window.addRecipeButton = function (add_id) {
  if (document.getElementById(add_id).style.backgroundColor == "rgb(67, 123, 120)") { // if button is pressed
    document.getElementById(add_id).style.backgroundColor = "#b4d6b4";
    hideElement(ADD_RECIPE_ID);
    showElement(RECIPES_ID);
  } else {
    document.getElementById(add_id).style.backgroundColor = "#437b78";
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
    <label for="recipe_name">Name*:</label><br>
    <input type="text" id="recipe_name" name="recipe_name"><br>
    <label for="link">Link:</label><br>
    <input type="text" id="link" name="link">
    <button id="add" type="button" onclick="parseLink()">Get Recipe from Link</button><br><br>
    <label for="ingredients">Ingredients:</label><br>
    <textarea id="parse-ingredients" name="ingredients"></textarea>
    <button id="parse-ingredients-button" type="button" onclick="parseIngredients('parse-ingredients')">Parse Ingredients</button><br><br>
    <label for="cooking_time_mins">Cooking Time (mins):</label><br>
    <input type="text" id="cooking_time_mins" name="cooking_time_mins"><br>
    <label for="instructions">Instructions:</label><br>
    <input type="text" id="instructions" name="instructions"><br>
    <label for="image">Image Link:</label><br>
    <input type="text" id="image" name="image"><br>
    <input type="submit" value="Submit">`
  main.appendChild(form);
}

window.submitRecipe = async function () {
  const name = document.getElementById('recipe_name').value;
  const link = document.getElementById('link').value;
  const cooking_time_mins = document.getElementById('cooking_time_mins').value;
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').value;

  const result = await postRecipe(name, cooking_time_mins, link, instructions, image);
  if (result != null) {
    console.log("Created recipe with id {}", result.id);
    const all_ingredients_added = await postRecipeIngredients(result.id);
    if (all_ingredients_added) {
      showMessage("Recipe added successfully!", true);
    } else {
      showMessage("Recipe added, but not all ingredients!", false);
    }
    window.location.href = "index.html";
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
    let amount = document.getElementById(tr_id + "-0");
    let unit = document.getElementById(tr_id + "-1");
    let name = document.getElementById(tr_id + "-2");
    let optional = document.getElementById(tr_id + "-3");
    const ingredient_id = await createIngredientIfNotExists(name.value);
    const result = await postRecipeIngredient(recipe_id, ingredient_id, optional.checked, amount.value, unit.value);
    if (result == null) {
      all_ingredients_added = false;
    }
  }
  return all_ingredients_added;
}

window.parseLink = function (link_id) {
  getParseRecipeLink(document.getElementById(link_id).value)
  .then(function(data) {
    // TODO: fill all fields of form with results
  })
}

window.parseIngredients = function (input_id) {
  getParseIngredients(document.getElementById(input_id).value)
    .then(function (data) {
      if (data == null) {
        console.log("Could not parse ingredients");
        return false;
      }

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

      const button = document.getElementById(input_id + "-button");
      button.parentNode.insertBefore(add_ingredient_button, button.nextSibling);
      button.parentNode.insertBefore(table, button.nextSibling);
      data.items.forEach(ingredient => {
        addIngredientRow(ingredient.amount, ingredient.unit, ingredient.name);
      });
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
