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
      "optional": optional == true,
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
      "optional": optional == true,
      ...amount && { 'amount': amount },
      ...unit && { 'unit': unit },
    })
  }).then(response => {
    return response;
  });
}

export async function listRecipeIngredients(recipe_id = null, ingredient_id = null, name_contains = null, page = 1, per_page = 25) {
  let params = `?page=${page}&per_page=${per_page}`;
  if (recipe_id != null) {
    params += "&recipe_id=" + recipe_id;
  }
  if (ingredient_id != null) {
    params += "&ingredient_id=" + ingredient_id;
  }
  if (name_contains != null) {
    params += "&name_contains=" + name_contains;
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

export async function makeRecipeIngredientIfNotExists(recipe_id, ingredient_id, optional = false, amount = null, unit = null) {
  let resp;
  await listRecipeIngredients(recipe_id, ingredient_id).then(async response => {
    if (response.ok) {
      const data = await response.json();
      if (data.items.length > 0) {
        const id = data.items[0].id;
        await putRecipeIngredient(id, recipe_id, ingredient_id, optional, amount, unit).then(response => {
          resp = response;
        })
      } else {
        await postRecipeIngredient(recipe_id, ingredient_id, optional, amount, unit).then(response => {
          resp = response;
        })
      }
    } else {
      resp = response;
    }
  });
  return resp;
} 
