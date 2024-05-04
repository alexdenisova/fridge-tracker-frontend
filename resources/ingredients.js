import "./ingredients/add.js";
import { main } from "./ingredients/constants.js";
import { showIngredients as listIngredients } from "./ingredients/list.js";
import "./ingredients/show.js";

const search_container = document.getElementById("search-container");
const search = document.getElementById("query");

listIngredients();

// search_container.addEventListener("submit", (e) => {
//   e.preventDefault();
//   main.innerHTML = '';

//   const searchItem = search.value;

//   if (searchItem) {
//     listIngredients(`name_contains=${searchItem}`);
//     search.value = "";
//   }
// });
