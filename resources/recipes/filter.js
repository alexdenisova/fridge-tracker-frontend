import { listRecipeIngredients } from "../backend/recipe_ingredients.js";
import { PAGINATION_ID } from '../constants.js';
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

var INGREDIENT_PAGE = 1;
var MAX_INGREDIENT_PAGE = null;
const INGREDIENT_PER_PAGE = 5;

window.filterButton = function (filter_id) {
  if (buttonIsPressed(filter_id)) {
    if (document.getElementById(FILTER_ID).style.display == "none") {
      hideElement(LIST_ID);
      hideElement(PAGINATION_ID);
      showElement(FILTER_ID, "block");
    } else {
      clickButton(filter_id)
      hideElement(FILTER_ID);
      showElement(LIST_ID);
      showElement(PAGINATION_ID);
    }
  } else {
    clickButton(filter_id)
    hideElement(LIST_ID);
    hideElement(PAGINATION_ID);
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
      <div id='${FILTER_INGREDIENT_LIST_ID}' class="options" onscroll='onScroll();'>
      </div>
      <button class="apply" onclick="filterByIngredients()">Apply</button>`;
      document.getElementById(FILTER_ID).appendChild(div);

      addIngredients();
      document.getElementById(FILTER_TEXT_ID).addEventListener("keyup", search_ingredients);
    } else {
      showElement("ingredients-container", "block");
    }
    document.getElementById('by-ingredients').style.backgroundColor = CLICKED_COLOR;
  } else {
    hideElement("ingredients-container");
    document.getElementById('by-ingredients').style.backgroundColor = UNCLICKED_COLOR;
  }
}

// Adds to the ingredient list when user scrolls to the bottom
window.onScroll = function () {
  var myElement = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  if (myElement.scrollTop + myElement.clientHeight > myElement.scrollHeight - 1 && INGREDIENT_PAGE <= MAX_INGREDIENT_PAGE) {
    addIngredients();
  }
}

function addIngredients(name_contains = null) {
  const list = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  listRecipeIngredients(null, null, name_contains, INGREDIENT_PAGE, INGREDIENT_PER_PAGE).then(response => response.json()).then(data => {
    for (const item of data.items) {
      const div = document.createElement('div');
      div.innerHTML = `<input type="checkbox" name="${item.ingredient_name}" value="${item.name}">
        <label for="${item.ingredient_name}" id="${item.id}">${item.ingredient_name}</label>`;
      list.appendChild(div);
    }
    INGREDIENT_PAGE++;
    if (MAX_INGREDIENT_PAGE == null) {
      MAX_INGREDIENT_PAGE = data._metadata.page_count;
    }
  });
}

function search_ingredients() {
  var name_contains = document.getElementById(FILTER_TEXT_ID).value.toUpperCase();
  if (name_contains == '') {
    name_contains = null;
  }
  const ingredients = document.getElementById(FILTER_INGREDIENT_LIST_ID);

  while (ingredients.firstChild) {
    ingredients.removeChild(ingredients.lastChild);
  }
  INGREDIENT_PAGE = 1;
  MAX_INGREDIENT_PAGE = null;
  addIngredients(name_contains);
}

window.filterByIngredients = async function () {
  const ingredients = document.getElementById(FILTER_INGREDIENT_LIST_ID);
  let ingredient_list = "[";
  let first = true;
  for (let i = 0; i < ingredients.childElementCount; i++) {
    let div = ingredients.children[i];
    if (div.getElementsByTagName("input")[0].checked) {
      let ingredient_id = div.getElementsByTagName("label")[0].id;
      if (!first) {
        ingredient_list += ',';
      } else {
        first = false;
      }
      ingredient_list += encodeURIComponent('"' + ingredient_id + '"');
    }
  }
  ingredient_list += "]";
  hideElement(FILTER_ID);
  showElement(LIST_ID);
  showElement(PAGINATION_ID);
  showRecipes(1, `ingredient_ids=${ingredient_list}`);
}
