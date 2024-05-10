import { getIngredientName, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { deleteRecipeIngredient, listRecipeIngredients, postRecipeIngredient } from "../backend/recipe_ingredients.js";
import { deleteRecipe, getRecipe, putRecipe } from "../backend/recipes.js";
import { getOrNull, showMessage, showMessageThenRedirect } from "../utils.js";
import { INGREDIENT_TABLE_ID, main } from "./constants.js";
import { createTable } from './ingredient_table.js';

const CHANGE_ID = "change_recipe";
const SAVE_ID = "save_recipe";
const DELETE_ID = "delete_recipe";

export function showRecipe(item_id) {
  getRecipe(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessageThenRedirect("Could not get recipe.", false, "index.html");
      return false;
    }
    const form = document.createElement('form');
    form.setAttribute("id", CHANGE_ID);

    const recipe = await response.json();
    let inner_html = `<p class="title" id="name">${recipe.name}</p>
      <p class="detail">Rating: <input type="text" id="rating" value="${recipe.rating || ""}">⭐</p>
      <p class="detail">Last Cooked: <input type="text" id="last_cooked" value="${recipe.last_cooked || ""}"></p>
      <p class="detail">Notes:</p>
      <textarea id="notes">${recipe.notes || ""}</textarea>
      <p class="detail">Link: <input type="text" id="link" value="${recipe.link || ""}"></p>
      <p class="detail">Prep Time: <input type="text" id="prep_time" value="${recipe.prep_time_mins || ""}">mins</p>
      <p class="detail">Total Time: <input type="text" id="total_time" value="${recipe.total_time_mins || ""}">mins</p>
      <p class="detail">Instructions:</p>
      <textarea id="instructions">${recipe.instructions || ""}</textarea>
      <p class="detail">Image Link: <input type="text" id="image" value="${recipe.image || ""}"></p>`;

    const ingredient_response = await listRecipeIngredients(recipe.id);
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
      }
      showMessage("Could not get recipe ingredients.", false);
    }
    const ingredients = await ingredient_response.json();
    let parsed_ingredients = [];
    for (var i = 0; i < ingredients.items.length; i++) {
      const amount = ingredients.items[i].amount || "-";
      const unit = ingredients.items[i].unit || "-";
      const optional = ingredients.items[i].optional || false;
      const name = await getIngredientName(ingredients.items[i].ingredient_id);
      parsed_ingredients.push({ 'amount': amount, 'unit': unit, 'name': name, 'optional': optional });
    }

    inner_html += createTable(parsed_ingredients);

    inner_html += `<br><button type="button" id="${SAVE_ID}" onclick="saveRecipe('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
    <button type="button" id="${DELETE_ID}" onclick="removeRecipe('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>`;
    form.innerHTML = inner_html;
    main.appendChild(form);
  });
}

window.removeRecipe = async function (item_id) {
  const response = await deleteRecipe(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to delete recipe!", false);
  } else {
    showMessageThenRedirect("Successfully deleted recipe.", true, "index.html");
  }
  return false;
}

window.saveRecipe = async function (item_id) {
  const name = document.getElementById('name').innerText;
  const link = getOrNull(document.getElementById('link'), "value");
  const prep_time = getOrNull(document.getElementById('prep_time'), "value");
  const total_time = getOrNull(document.getElementById('total_time'), "value");
  const instructions = getOrNull(document.getElementById('instructions'), "value");
  const image = getOrNull(document.getElementById('image'), "value");
  const last_cooked = document.getElementById('last_cooked').value;
  const rating = Number(document.getElementById('rating').value);
  const notes = document.getElementById('notes').value;

  const response = await putRecipe(item_id, name, prep_time, total_time, link, instructions, image, last_cooked, rating, notes);
  if (response.ok) {
    const data = await response.json();
    const all_ingredients_added = await postOrPutRecipeIngredients(data.id);
    if (all_ingredients_added) {
      showMessageThenRedirect("Successfully saved recipe!", true, "index.html");
    } else {
      showMessageThenRedirect("Recipe saved, but not all ingredients!", false, "recipe.html?id=" + item_id);
    }
  } else if (response.status == 401) {
    redirectToLogin();
  } else {
    showMessage("Failed to save recipe!", false);
  }
  return false;
}

async function removeRecipeIngredients(recipe_id) {
  const list_response = await listRecipeIngredients(recipe_id);
  if (!list_response.ok) {
    return false;
  }
  const ri = await list_response.json();
  for (var j = 0; j < ri.items.length; j++) {
    await deleteRecipeIngredient(ri.items[j].id);
  }
  return true;
}

async function postOrPutRecipeIngredients(recipe_id) {
  if (! await removeRecipeIngredients(recipe_id)) {
    return false;
  }

  const table = document.getElementById(INGREDIENT_TABLE_ID);

  let all_ingredients_added = true;
  for (var i = 0; i < table.children[1].childElementCount; i++) {
    const tr_id = table.children[1].children[i].id;
    let amount = getOrNull(document.getElementById(tr_id + "-0"), "value");
    let unit = getOrNull(document.getElementById(tr_id + "-1"), "value");
    let name = document.getElementById(tr_id + "-2").value;
    let optional = document.getElementById(tr_id + "-3").checked;
    const ingredient_id = await makeIngredientIfNotExists(name);

    const response = await postRecipeIngredient(recipe_id, ingredient_id, optional, amount, unit);
    if (!response.ok) {
      all_ingredients_added = false;
    }
  }
  return all_ingredients_added;
}
