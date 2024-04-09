import { createIngredientIfNotExists } from "./backend/ingredients.js";
import { getParseIngredients } from "./backend/parse_ingredients.js";
import { postRecipeIngredient } from "./backend/recipe_ingredients.js";
import { postRecipe } from "./backend/recipes.js";
import { RECIPES_ID } from "./recipes.js";
import { hideElement, showElement, showMessage } from "./utils.js";

export const PARSE_INGREDIENTS_ENDPOINT = 'http://localhost:8081/parse_ingredients';
const RECIPE_INGREDIENTS_ENDPOINT = 'http://localhost:8081/recipe_ingredients';

const ADD_RECIPE_ID = "add_recipes_form";
const PARSED_INGREDIENT_TABLE_ID = "parsed_ingredient_table";

const main = document.getElementById("section");

window.addRecipeButton = function (add_id) {
  if (document.getElementById(add_id).style.backgroundColor == "rgb(67, 123, 120)") {
    document.getElementById(add_id).style.backgroundColor = "#b4d6b4";
    hideElement(ADD_RECIPE_ID);
    showElement(RECIPES_ID);
  } else {
    document.getElementById(add_id).style.backgroundColor = "#437b78";
    hideElement(RECIPES_ID);
    if (document.getElementById(ADD_RECIPE_ID) == null) {
      addForm();
    } else {
      showElement(ADD_RECIPE_ID, "block");
    }
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
    const ing_result = await postRecipeIngredients(result.id);
    if (ing_result != null) {
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

  for (var i = 0; i < table.childElementCount - 1; i++) {
    let amount = document.getElementById(PARSED_INGREDIENT_TABLE_ID + "-" + i + "-0");
    let unit = document.getElementById(PARSED_INGREDIENT_TABLE_ID + "-" + i + "-1");
    let name = document.getElementById(PARSED_INGREDIENT_TABLE_ID + "-" + i + "-2");
    let optional = document.getElementById(PARSED_INGREDIENT_TABLE_ID + "-" + i + "-3");
    const ingredient_id = await createIngredientIfNotExists(name.value);
    return await postRecipeIngredient(recipe_id, ingredient_id, optional.checked, amount.value, unit.value);
  }
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
  let index = Number(table.childElementCount) - 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
      <td><input type="text" id="${PARSED_INGREDIENT_TABLE_ID}-${index}-0" value="${amount}"></td>
      <td><input type="text" id="${PARSED_INGREDIENT_TABLE_ID}-${index}-1" value="${unit}"></td>
      <td><input type="text" id="${PARSED_INGREDIENT_TABLE_ID}-${index}-2" value="${name}"></td>
      <td><input type="checkbox" id="${PARSED_INGREDIENT_TABLE_ID}-${index}-3"></td>`;
  table.appendChild(tr);
  return false;
}
