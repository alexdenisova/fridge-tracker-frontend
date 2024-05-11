import { getIngredientId, listIngredients } from "../backend/ingredients.js";
import { buttonIsPressed, clickButton, hideElement, showElement } from "../utils.js";
import { unpressAddRecipeButton } from './add.js';
import { LIST_ID, main } from "./constants.js";
import { showRecipes } from "./list.js";

const FILTER_BUTTON_ID = "filter_recipes_button";
const FILTER_ID = "filter_div";
const FILTER_TEXT_ID = "searchInput";
const FILTER_INGREDIENT_LIST_ID = "filter_ingredient_list"
const UNCLICKED_COLOR = "rgb(255, 255, 255)";
const CLICKED_COLOR = "rgb(241, 240, 240)";

window.filterButton = function (filter_id) {
  if (buttonIsPressed(filter_id)) {
    if (document.getElementById(FILTER_ID).style.display == "none") {
      hideElement(LIST_ID);
      showElement(FILTER_ID, "block");
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
      addFilterOptions();
    } else {
      showElement(FILTER_ID, "block");
    }
  }
}

export function unpressFilterButton() {
  document.getElementById(FILTER_BUTTON_ID).style.backgroundColor = "#b4d6b4";
  if (document.getElementById(FILTER_ID) != null) {
    hideElement(FILTER_ID);
  }
}

function addFilterOptions() {
  const filters = document.createElement("div");
  filters.setAttribute("id", FILTER_ID);
  filters.innerHTML = `
  <button id='by-ingredients' class="filter" onclick="byIngredients()">
    Ingredients
    <span class="material-symbols-outlined">
    expand_more
    </span>
  </button>
  <button class="filter" onclick="window.location.href = '/index.html';" style="height:80%;margin-left:10px;">
    Clear filters
  </button>`;
  main.appendChild(filters);
}

window.byIngredients = function () {
  if (getComputedStyle(document.getElementById('by-ingredients')).backgroundColor == UNCLICKED_COLOR) {
    if (document.getElementById("ingredients-container") == null) {
      const div = document.createElement("div");
      div.setAttribute("class", "container");
      div.setAttribute("id", "ingredients-container");
      div.innerHTML = `
      <input type="text" id="${FILTER_TEXT_ID}" placeholder="Find ingredient">
      <div id='${FILTER_INGREDIENT_LIST_ID}' class="options">
      </div>
      <button class="apply" onclick="filterByIngredients()">Apply</button>`;
      document.getElementById(FILTER_ID).appendChild(div);

      addIngredients();
      document.getElementById(FILTER_TEXT_ID).addEventListener("keyup", filter);
    } else {
      showElement("ingredients-container", "block");
    }
    document.getElementById('by-ingredients').style.backgroundColor = CLICKED_COLOR;
  } else {
    hideElement("ingredients-container");
    document.getElementById('by-ingredients').style.backgroundColor = UNCLICKED_COLOR;
  }
}

function addIngredients() {
  const list = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  listIngredients().then(response => response.json()).then(data => {
    for (const item of data.items) {
      const div = document.createElement('div');
      div.innerHTML = `<input type="checkbox" name="${item.name}" value="${item.name}" id="${item.name}">
        <label for="${item.name}">${item.name}</label>`;
      list.appendChild(div);
    }
  })
}

function filter() {
  let value = document.getElementById(FILTER_TEXT_ID).value.toUpperCase();
  var names = document.getElementById(FILTER_INGREDIENT_LIST_ID);

  for (var i = 0; i < names.childElementCount; i++) {
    let div = names.children[i];
    let name = div.getElementsByTagName("label")[0].innerText;
    div.style.display =
      name.toUpperCase().indexOf(value) > -1 ? "" : "none";
  }
}

window.filterByIngredients = async function () {
  const ingredients = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  let ingredient_list = "[";
  let first = true;
  for (let i = 0; i < ingredients.childElementCount; i++) {
    let div = ingredients.children[i];
    if (div.getElementsByTagName("input")[0].checked) {
      let name = div.getElementsByTagName("label")[0].innerText;
      await getIngredientId(name).then(ingredient_id => {
        if (!first) {
          ingredient_list += ',';
        } else {
          first = false;
        }
        ingredient_list += '"' + encodeURIComponent(ingredient_id) + '"';
      });
    }
  }
  ingredient_list += "]";
  hideElement(FILTER_ID);
  removeElement(LIST_ID);
  showRecipes(`ingredient_ids=${ingredient_list}`)
  showElement(LIST_ID);
}
