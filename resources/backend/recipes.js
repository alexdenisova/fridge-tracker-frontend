
export const RECIPE_ENDPOINT = 'http://localhost:8080/api/recipes';

export async function getRecipe(id) {
  return await fetch(RECIPE_ENDPOINT + `/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
      return response;
  });
}

export async function listRecipes(query_params = null) {
  let url = RECIPE_ENDPOINT;
  if (query_params != null) {
    url += "?" + query_params;
  }
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
      return response;
  });
}

export async function postRecipe(name, cooking_time_mins = null, link = null, instructions = null, image = null) {
  return await fetch(RECIPE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      ...cooking_time_mins && { 'cooking_time_mins': Number(cooking_time_mins) },
      ...link && { 'link': link },
      ...instructions && { 'instructions': instructions },
      ...image && { 'image': image },
    })
  }).then(response => {
      return response;
  });
}
