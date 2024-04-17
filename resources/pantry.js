import "./pantry/add.js";
import { main } from "./pantry/constants.js";
import { showPantryItems as listPantryItems } from "./pantry/list.js";
import "./pantry/show.js";

const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

listPantryItems();

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    listPantryItems(`name_contains=${searchItem}`);
    search.value = "";
  }
});
