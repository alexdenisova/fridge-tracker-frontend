import { showPantryItem } from "./pantry/show";

const url = new URL(location.href);
const item_id = url.searchParams.get("id")

showPantryItem(item_id);
