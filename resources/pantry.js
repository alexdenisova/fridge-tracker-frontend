import "./pantry/add.js";
import { main } from "./pantry/constants.js";
import { showPantryItems } from "./pantry/list.js";
import "./pantry/show.js";

const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

const url = new URL(location.href);
const page = url.searchParams.get("page");
const query_params = url.searchParams;
query_params.delete("page")

showPantryItems(page ? page : 1, query_params.toString());

search_container.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    showPantryItems(1, `name_contains=${searchItem}`);
    search.value = "";
  }
});
