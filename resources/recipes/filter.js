import { getIngredientId } from "../backend/ingredients.js";
import { buttonIsPressed, clickButton, hideElement, showElement } from "../utils.js";
import { unpressAddRecipeButton } from './add.js';
import { LIST_ID, main } from "./constants.js";
import { showRecipes } from "./list.js";

const FILTER_BUTTON_ID = "filter_recipes_button";
const FILTER_ID = "filter_div";
const FILTER_POPUP_ID = "filter_popup";
const FILTER_TEXT_ID = "filter_text";
const FILTER_ADD_BUTTON_ID = "filter_add";
const FILTER_INGREDIENT_LIST_ID = "filter_ingredient_list"

window.filterButton = function (filter_id) {
  if (buttonIsPressed(filter_id)) {
    if (document.getElementById(FILTER_ID).style.display == "none") {
      hideElement(LIST_ID);
      showElement(FILTER_ID);
    } else {
      clickButton(filter_id)
      hideElement(FILTER_ID);
      showElement(LIST_ID);
    }
  } else {
    clickButton(filter_id)
    hideElement(LIST_ID);
    unpressAddRecipeButton();
    if (document.getElementById(FILTER_ID) == null) {
      addFilter();
    } else {
      showElement(FILTER_ID);
    }
  }
}

export function unpressFilterButton() {
  document.getElementById(FILTER_BUTTON_ID).style.backgroundColor = "#b4d6b4";
  if (document.getElementById(FILTER_ID) != null) {
    hideElement(FILTER_ID);
  }
}

function addFilter() {
  const div = document.createElement("div");
  div.setAttribute("id", FILTER_ID);
  div.innerHTML = `
    <div id="${FILTER_POPUP_ID}">
      <pre><strong>Needs Ingredient: </strong>
      <input type="text" id="${FILTER_TEXT_ID}" value=""><a id="${FILTER_ADD_BUTTON_ID}" href="#" onclick="addIngredient()" style="text-decoration:none;">➕</a>
          </pre>
      <ul id='${FILTER_INGREDIENT_LIST_ID}' class="removable_list">
      </ul>
      <button onclick="filterRecipes()">Find recipes</button>
    </div>`;
  main.appendChild(div);
  document.getElementById(FILTER_TEXT_ID).addEventListener("keypress", enterEventListener);
}

function enterEventListener(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById(FILTER_ADD_BUTTON_ID).click();
  }
}

window.addIngredient = function () {
  const text = document.getElementById(FILTER_TEXT_ID).value;
  const list = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  const li = document.createElement('li');
  li.setAttribute("id", text);
  li.innerHTML = `<p>${text}</p>
  <button onclick="removeElement('${text}')">❌</button>`;
  list.appendChild(li);
  document.getElementById(FILTER_TEXT_ID).value = "";
}

window.filterRecipes = async function () {
  const ingredients = document.getElementById(FILTER_INGREDIENT_LIST_ID).getElementsByTagName("li");
  let ingredient_list = "[";
  for (let i = 0; i < ingredients.length; i++) {
    await getIngredientId(ingredients[i].id).then(ingredient_id => {
      ingredient_list += '"' + encodeURIComponent(ingredient_id) + '"';
      if (i != ingredients.length - 1) {
        ingredient_list += ',';
      }
    });
  }
  ingredient_list += "]";
  hideElement(FILTER_ID);
  removeElement(LIST_ID);
  showRecipes(`ingredient_ids=${ingredient_list}`)
  showElement(LIST_ID);
}
