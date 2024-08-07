import { RECIPE_ENDPOINT } from "./constant";


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

export async function listRecipes(page, per_page, query_params = null) {
  let options = `?page=${page}&per_page=${per_page}`;
  if (query_params != null) {
    options += "&" + query_params;
  }
  return await fetch(RECIPE_ENDPOINT + options, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function postRecipe(name, prep_time_mins = null, total_time_mins = null, link = null, instructions = null, image = null, last_cooked = null, rating = null, notes = null) {
  return await fetch(RECIPE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      ...prep_time_mins && { 'prep_time_mins': Number(prep_time_mins) },
      ...total_time_mins && { 'total_time_mins': Number(total_time_mins) },
      ...link && { 'link': link },
      ...instructions && { 'instructions': instructions },
      ...image && { 'image': image },
      ...last_cooked && { 'last_cooked': last_cooked },
      ...rating && { 'rating': rating },
      ...notes && { 'notes': notes },
    })
  }).then(response => {
    return response;
  });
}

export async function deleteRecipe(id) {
  return await fetch(RECIPE_ENDPOINT + `/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function putRecipe(id, name, prep_time_mins = null, total_time_mins = null, link = null, instructions = null, image = null, last_cooked = null, rating = null, notes = null) {
  return await fetch(RECIPE_ENDPOINT + "/" + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      ...prep_time_mins && { 'prep_time_mins': Number(prep_time_mins) },
      ...total_time_mins && { 'total_time_mins': Number(total_time_mins) },
      ...link && { 'link': link },
      ...instructions && { 'instructions': instructions },
      ...image && { 'image': image },
      ...last_cooked && { 'last_cooked': last_cooked },
      ...rating && { 'rating': rating },
      ...notes && { 'notes': notes },
    })
  }).then(response => {
    return response;
  });
}
