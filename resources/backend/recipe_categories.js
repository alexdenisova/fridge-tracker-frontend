import { RECIPE_CATEGORY_ENDPOINT } from "./constant";


export async function postRecipeCategory(recipe_id, category_id) {
  return await fetch(RECIPE_CATEGORY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "recipe_id": recipe_id,
      "category_id": category_id,
    })
  }).then(response => {
    return response;
  });
}

export async function listRecipeCategories(recipe_id = null, category_id = null, page = 1, per_page = 25) {
  let params = `?page=${page}&per_page=${per_page}`;
  if (recipe_id != null) {
    params += "&recipe_id=" + recipe_id;
  }
  if (category_id != null) {
    params += "&category_id=" + category_id;
  }
  return await fetch(RECIPE_CATEGORY_ENDPOINT + params, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function getRecipeCategory(id) {
  return await fetch(RECIPE_CATEGORY_ENDPOINT + "/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function deleteRecipeCategory(id) {
  return await fetch(RECIPE_CATEGORY_ENDPOINT + "/" + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}
