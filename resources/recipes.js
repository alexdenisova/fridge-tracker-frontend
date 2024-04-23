import "./recipes/add.js";
import { main } from "./recipes/constants.js";
import "./recipes/filter.js";
import { showRecipes } from "./recipes/list.js";
import "./recipes/show.js";
import "./utils.js";

const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

showRecipes();

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    showRecipes(`name_contains=${searchItem}`);
    search.value = "";
  }
});
