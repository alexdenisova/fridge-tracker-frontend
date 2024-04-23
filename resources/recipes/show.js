import { getIngredientName, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { deleteRecipeIngredient, listRecipeIngredients, postRecipeIngredient } from "../backend/recipe_ingredients.js";
import { deleteRecipe, getRecipe, putRecipe } from "../backend/recipes.js";
import { getOrNull, showMessage } from "../utils.js";
import { INGREDIENT_TABLE_ID, main } from "./constants.js";
import { createTable } from './ingredient_table.js';

const CHANGE_ID = "change_recipe";
const SAVE_ID = "save_recipe";
const DELETE_ID = "delete_recipe";

var clicked;

export function showRecipe(item_id) {
  getRecipe(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessage("Could not get recipe.", false);
      return false;
    }
    const data = await response.json();

    const form = document.createElement('form');
    form.setAttribute("onsubmit", "changeRecipe('" + item_id + "'); return false;");
    form.setAttribute("id", CHANGE_ID);
    main.appendChild(form);

    let inner_html = `<p class="title" id="edit_name">${data.name}</p>
      <p class="detail">Link: <input type="text" id="edit_link" value="${data.link || ""}"></p>
      <p class="detail">Cooking Time: <input type="text" id="edit_cooking_time" value="${data.cooking_time_mins || ""}">mins</p>
      <p class="detail">Instructions:</p>
      <textarea id="edit_instructions">${data.instructions || ""}</textarea>
      <p class="detail">Image Link: <input type="text" id="edit_image" value="${data.image || ""}"></p>`;

    const ingredient_response = await listRecipeIngredients(data.id);
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

    inner_html += `<br><input type="submit" id="${SAVE_ID}" onclick="clickSubmit('Save');" value="Save" style="width:20%;height:100%;">
    <input type="submit" id="${DELETE_ID}" onclick="clickSubmit('Delete');" value="Delete" style="width:20%;height:100%;">`;
    document.getElementById(CHANGE_ID).innerHTML = inner_html;

  });
}

window.clickSubmit = function (name) {
  console.log('clicked');
  clicked = name;
}

window.changeRecipe = async function (item_id) {
  if (clicked == "Save") {
    await saveRecipe(item_id);
  } else if (clicked == "Delete") {
    await removeRecipe(item_id);
  }
}

async function removeRecipe(item_id) {
  const response = await deleteRecipe(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    showMessage("Failed to delete recipe!", false);
    return false;
  } else {
    await removeRecipeIngredients(item_id);
    showMessage("Recipe deleted successfully!", true);
    window.location.href = "index.html";
    return false;
  }
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

async function saveRecipe(item_id) {
  const name = document.getElementById('edit_name').innerText;
  const link = getOrNull(document.getElementById('edit_link'), "value");
  const cooking_time = getOrNull(document.getElementById('edit_cooking_time'), "value");
  const instructions = getOrNull(document.getElementById('edit_instructions'), "value");
  const image = getOrNull(document.getElementById('edit_image'), "value");

  const response = await putRecipe(item_id, name, cooking_time, link, instructions, image);
  if (response.ok) {
    const data = await response.json();
    console.log("Saved recipe with id {}", data.id);
    const all_ingredients_added = await postOrPutRecipeIngredients(data.id);
    if (all_ingredients_added) {
      showMessage("Recipe saved successfully!", true);
    } else {
      showMessage("Recipe saved, but not all ingredients!", false);
    }
    // window.location.href = "index.html";
    return false;
  } else if (response.status == 401) {
    redirectToLogin();
    return false;
  } else {
    showMessage("Failed to save recipe!", false);
    return false;
  }
}

async function postOrPutRecipeIngredients(recipe_id) {
  if (! await removeRecipeIngredients(recipe_id)) {
    return false;
  }

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
      all_ingredients_added = false;
    }
  }
  return all_ingredients_added;
}
