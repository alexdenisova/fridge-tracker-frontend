import { getIngredientName, makeIngredientIfNotExists } from "../backend/ingredients.js";
import { listRecipeCategories } from "../backend/recipe_categories.js";
import { listRecipeIngredients, makeRecipeIngredientIfNotExists } from "../backend/recipe_ingredients.js";
import { deleteRecipe, getRecipe, putRecipe } from "../backend/recipes.js";
import { TAGS_INPUT, TAGS_LIST, createTag } from "../categories.js";
import { checkAuth, getOrNull, showMessage, showMessageThenRedirect } from "../utils.js";
import { INGREDIENT_TABLE_ID, main } from "./constants.js";
import { createTable, ingredientRowChanged } from './ingredient_table.js';
import { createStar, getRating } from './utils.js';

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
    const div = document.createElement("div");
    div.setAttribute("class", "form");
    div.setAttribute("id", CHANGE_ID);

    const recipe = await response.json();
    const ingredient_response = await listRecipeIngredients(recipe.id); // TODO: check that no more pages left
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

    const categories_response = await listRecipeCategories(recipe.id);
    if (!response.ok) {
      checkAuth(response.status);
      showMessage("Could not get recipe categories.", false);
    }

    div.innerHTML = `
    <div class="form-heading">${recipe.name}</div>
      <form>
        <label for="recipe_name"><span>Recipe Name<span class="required">*</span></span><input type="text" class="input-field" id="recipe_name" name="recipe_name" value="${recipe.name}"></label>
        <label for="rating"><span>Rating</span>${createStar(recipe.rating)}</label>
        <label for="categories"><span>Categories</span><div class="categories-content"><ul id="${TAGS_LIST}"><input type="text" class="input-field" id="${TAGS_INPUT}" name="categories"></ul></div></label>
        <label for="last_cooked"><span>Last Cooked</span><input type="date" class="input-field" id="last_cooked" name="last_cooked" placeholder="YYYY-MM-DD" value="${recipe.last_cooked || ""}"></label>
        <label for="notes"><span>Notes</span><textarea id="notes" name="notes" class="textarea-field">${recipe.notes || ""}</textarea></label>
        <label for="link"><span>Link</span><input type="text" class="input-field" id="link" name="link" value="${recipe.link || ""}"></label>
        <label for="prep_time_mins"><span>Prep Time (mins)</span><input type="text" class="input-field" id="prep_time_mins" name="prep_time_mins" value="${recipe.prep_time_mins || ""}"></label>
        <label for="total_time_mins"><span>Total Time (mins)</span><input type="text" class="input-field" id="total_time_mins" name="total_time_mins" value="${recipe.total_time_mins || ""}"></label>
        <label for="instructions"><span>Instructions <span class="required">*</span></span><textarea id="instructions" name="instructions" class="textarea-field">${recipe.instructions || ""}</textarea></label>
        <label for="image"><span>Image Link</span><input type="text" class="input-field" id="image" name="image" value="${recipe.image || ""}"></label>
        <label for="ingredients"><span>Ingredients<span class="required">*</span></span></label>
        ${createTable(parsed_ingredients)}<br><br>
        <button type="button" id="${SAVE_ID}" onclick="saveRecipe('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
        <button type="button" id="${DELETE_ID}" onclick="removeRecipe('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>
      </form>`;
    main.appendChild(div);
    for (const c of (await categories_response.json()).items) {
      createTag(c.category_name);
    }
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
  const name = document.getElementById('recipe_name').value;
  const link = getOrNull(document.getElementById('link'), "value");
  const prep_time = getOrNull(document.getElementById('prep_time_mins'), "value");
  const total_time = getOrNull(document.getElementById('total_time_mins'), "value");
  const instructions = getOrNull(document.getElementById('instructions'), "value");
  const image = getOrNull(document.getElementById('image'), "value");
  const last_cooked = document.getElementById('last_cooked').value;
  let rating = getRating();
  if (rating == 0) {
    rating = null;
  }
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

async function postOrPutRecipeIngredients(recipe_id) {
  const table = document.getElementById(INGREDIENT_TABLE_ID);

  let all_ingredients_added = true;
  for (var i = 0; i < table.children[1].childElementCount; i++) {
    const tr_id = table.children[1].children[i].id;
    if (ingredientRowChanged(tr_id) == "true") {
      console.log("Updating recipe ingredient " + tr_id);
      let amount = getOrNull(document.getElementById(tr_id + "-0"), "value");
      let unit = getOrNull(document.getElementById(tr_id + "-1"), "value");
      let name = document.getElementById(tr_id + "-2").value;
      let optional = document.getElementById(tr_id + "-3").checked;
      const ingredient_id = await makeIngredientIfNotExists(name);

      const response = await makeRecipeIngredientIfNotExists(recipe_id, ingredient_id, optional, amount, unit);
      if (!response.ok) {
        all_ingredients_added = false;
      }
    }
  }
  return all_ingredients_added;
}
