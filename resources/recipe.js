import "./recipes/ingredient_table.js";
import { showRecipe } from "./recipes/show.js";
import './recipes/utils.js';

const url = new URL(location.href);
const recipe_id = url.searchParams.get("id")

showRecipe(recipe_id);
