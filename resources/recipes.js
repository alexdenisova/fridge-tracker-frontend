import "./recipes/add.js";
import { main } from "./recipes/constants.js";
import "./recipes/filter.js";
import { showRecipes } from "./recipes/list.js";
import "./recipes/show.js";
import './recipes/utils.js';
import "./utils.js";

const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

const url = new URL(location.href);
const page = url.searchParams.get("page");
const query_params = url.searchParams;
query_params.delete("page");

showRecipes(page ? page : 1, query_params.toString());

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    showRecipes(1, `name_contains=${searchItem}`);
    search.value = "";
  }
});
