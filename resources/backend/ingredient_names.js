import { responseIsOk } from "../utils";
import { INGREDIENT_NAME_ENDPOINT } from "./constant";


export async function getIngredientName(id) {
  return await fetch(INGREDIENT_NAME_ENDPOINT + `/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

/// Get ids of ingredients that contain ingredient_name
export async function listIngredientNames(ingredient_id = null) {
  let options = "";
  if (ingredient_id != null) {
    options = `?ingredient_id=${ingredient_id}`;
  }
  return await fetch(INGREDIENT_NAME_ENDPOINT + options, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function postIngredientName(ingredient_name, ingredient_id) {
  return await fetch(INGREDIENT_NAME_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": ingredient_name,
      "ingredient_id": ingredient_id,
    })
  }).then(response => {
    return response;
  });
}

export async function deleteIngredientName(id) {
  return await fetch(INGREDIENT_NAME_ENDPOINT + "/" + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}
