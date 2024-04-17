import { PARSE_RECIPE_LINK_ENDPOINT } from "./constant";


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
