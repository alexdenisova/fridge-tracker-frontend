const PARSE_RECIPE_LINK_ENDPOINT = 'http://localhost:8080/api/parse_recipe_link';


export async function getParseRecipeLink(link) {
  return await fetch(PARSE_RECIPE_LINK_ENDPOINT + `?link=` + encodeURIComponent(link), {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}
