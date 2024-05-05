import { RECIPE_INGREDIENT_ENDPOINT } from "./constant";


export async function postRecipeIngredient(recipe_id, ingredient_id, optional = false, amount = null, unit = null) {
  return await fetch(RECIPE_INGREDIENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "recipe_id": recipe_id,
      "ingredient_id": ingredient_id,
      "optional": optional === "true",
      ...amount && { 'amount': amount },
      ...unit && { 'unit': unit },
    })
  }).then(response => {
    return response;
  });
}

export async function putRecipeIngredient(id, recipe_id, ingredient_id, optional = false, amount = null, unit = null) {
  return await fetch(RECIPE_INGREDIENT_ENDPOINT + "/" + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "recipe_id": recipe_id,
      "ingredient_id": ingredient_id,
      "optional": optional === "true",
      ...amount && { 'amount': amount },
      ...unit && { 'unit': unit },
    })
  }).then(response => {
    return response;
  });
}

export async function listRecipeIngredients(recipe_id, ingredient_id = null) {
  let params = "";
  if (recipe_id != null) {
    params = "?recipe_id=" + recipe_id;
  }
  if (ingredient_id != null) {
    params = "?ingredient_id=" + ingredient_id;
  }
  return await fetch(RECIPE_INGREDIENT_ENDPOINT + params, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function getRecipeIngredient(id) {
  return await fetch(RECIPE_INGREDIENT_ENDPOINT + "/" + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function deleteRecipeIngredient(id) {
  return await fetch(RECIPE_INGREDIENT_ENDPOINT + "/" + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}