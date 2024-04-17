import "./recipes/ingredient_table.js";
import { showRecipe } from "./recipes/show";

const url = new URL(location.href);
const recipe_id = url.searchParams.get("id")

showRecipe(recipe_id);
