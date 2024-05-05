import { deleteIngredient, getIngredient, getIngredientId, getIngredientName } from "../backend/ingredients.js";
import { listIngredientNames, deleteIngredientName, postIngredientName } from "../backend/ingredient_names.js";
import { listRecipeIngredients, putRecipeIngredient } from "../backend/recipe_ingredients.js";
import { listPantryItems, putPantryItem } from "../backend/pantry_items.js";
import { showMessage, showMessageThenRedirect, getOrNull } from "../utils.js";
import { main } from "./constants.js";

const CHANGE_ID = "change_ingredient";
const SAVE_ID = "save_ingredient";
const DELETE_ID = "delete_ingredient";
const ADD_NAME_BUTTON_ID = "add_name_button";
const ADD_NAME_TEXT_ID = "add_name";
const INGREDIENT_NAME_LIST_ID = "ingredient_name_list";

export function showIngredient(item_id) {
  getIngredient(item_id).then(async function (response) {
    if (!response.ok) {
      if (response.status == 401) {
        redirectToLogin();
        return false;
      }
      showMessageThenRedirect("Could not get ingredient.", false, "ingredients.html");
      return false;
    }
    const form = document.createElement('form');
    form.setAttribute("id", CHANGE_ID);

    const ingredient = await response.json();
    let inner_html = `<p class="title" id="ingredient_name">${ingredient.name}</p>
      <label for="parent">Make child of:</label>
      <input type="text" id="parent" name="parent">
      <p>Other names: <input type="text" id="${ADD_NAME_TEXT_ID}" value=""><a id="${ADD_NAME_BUTTON_ID}" href="#" onclick="addIngredientName()" style="text-decoration:none;">➕</a></p>
      <ul id='${INGREDIENT_NAME_LIST_ID}' class="removable_list">
      </ul>
      <button type="button" id="${SAVE_ID}" onclick="saveIngredient('${item_id}');" value="Save" style="width:20%;height:100%;">Save</button>
      <button type="button" id="${DELETE_ID}" onclick="removeIngredient('${item_id}');" value="Delete" style="width:20%;height:100%;">Delete</button>`;
    form.innerHTML = inner_html;
    main.appendChild(form);

    const names = await (await listIngredientNames(item_id)).json();
    const list = document.getElementById(INGREDIENT_NAME_LIST_ID);
    for (const item of names.items) {
      const li = document.createElement('li');
      li.setAttribute("id", item.name);
      li.innerHTML = `<p>${item.name}</p>
      <button onclick="removeElement('${item.name}')">❌</button>`;
      list.appendChild(li);
    }
  });
}

window.addIngredientName = function () {
  const text = document.getElementById(ADD_NAME_TEXT_ID).value;
  const list = document.getElementById(INGREDIENT_NAME_LIST_ID);
  const li = document.createElement('li');
  li.setAttribute("id", text);
  li.innerHTML = `<p>${text}</p>
  <button onclick="removeElement('${text}')">❌</button>`;
  list.appendChild(li);
  document.getElementById(ADD_NAME_TEXT_ID).value = "";
}

window.removeIngredient = async function (item_id) {
  const response = await deleteIngredient(item_id);
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
    }
    showMessage("Failed to delete ingredient!", false);
  } else {
    showMessageThenRedirect("Successfully deleted ingredient.", true, "ingredients.html");
  }
  return false;
}

window.saveIngredient = async function (item_id) {
  const parent = getOrNull(document.getElementById('parent'), "value");
  const children = await (await listIngredientNames(item_id)).json();
  for (const child of children.items) {
    await deleteIngredientName(child.id);
  }
  const names = document.getElementById(INGREDIENT_NAME_LIST_ID).getElementsByTagName("li");
  for (let i = 0; i < names.length; i++) {
    console.log(names[i].id);
    await postIngredientName(names[i].id, item_id);
  }
  if (parent != null) {
    const parent_id = await getIngredientId(parent);
    const children = await (await listIngredientNames(item_id)).json();
    for (const child of children.items) {
      await deleteIngredientName(child.id);
      await postIngredientName(child.name, parent_id);
    }
    const recipe_ingredients = await (await listRecipeIngredients(null, item_id)).json();
    for (const ing of recipe_ingredients.items) {
      await putRecipeIngredient(ing.id, ing.recipe_id, parent_id, ing.optional, ing.amount, ing.unit)
    }
    const pantry_items = await (await listPantryItems("ingredient_id=" + item_id)).json();
    for (const ing of pantry_items.items) {
      console.log(ing.id);
      let map = new Map(Object.entries({
        "ingredient_id": parent_id,
        'purchase_date': ing.purchase_date,
        'expiration_date': ing.expiration_date,
        'running_low': ing.running_low,
        'quantity': ing.quantity,
        'weight_grams': ing.weight_grams,
        'volume_milli_litres': ing.volume_milli_litres,
        'essential': ing.essential,
      }));
      await putPantryItem(ing.id, map)
    }
    const item_name = await getIngredientName(item_id);
    await deleteIngredient(item_id);
    await postIngredientName(item_name, parent_id);
  }
  showMessageThenRedirect("Successfully updated ingredient!", true, "ingredients.html");
  return false;
}
