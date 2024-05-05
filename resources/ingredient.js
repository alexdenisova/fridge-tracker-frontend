import { showIngredient } from "./ingredients/show";
import "./utils.js";

const url = new URL(location.href);
const item_id = url.searchParams.get("id")

showIngredient(item_id);
