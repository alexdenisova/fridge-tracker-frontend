import { PARSE_INGREDIENTS_ENDPOINT } from "./constant";


export async function getParseIngredients(text) {
  return await fetch(PARSE_INGREDIENTS_ENDPOINT + `?text=` + encodeURIComponent(text), {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}
