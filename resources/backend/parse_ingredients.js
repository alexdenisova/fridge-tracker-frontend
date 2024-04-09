const PARSE_INGREDIENTS_ENDPOINT = 'http://localhost:8081/parse_ingredients';


export async function getParseIngredients(text) {
  return await fetch(PARSE_INGREDIENTS_ENDPOINT + `?text=` + encodeURIComponent(text), {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    if (!response.ok) {
      return null;
    } else {
      return response.json();
    }
  });
}
