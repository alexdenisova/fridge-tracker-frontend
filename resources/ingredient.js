import { showIngredient } from "./ingredients/show";

const url = new URL(location.href);
const item_id = url.searchParams.get("id")

showIngredient(item_id);
