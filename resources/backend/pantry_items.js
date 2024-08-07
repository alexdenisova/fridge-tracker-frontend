import { PANTRY_ITEMS_ENDPOINT } from "./constant";


export async function getPantryItem(id) {
  return await fetch(PANTRY_ITEMS_ENDPOINT + `/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function listPantryItems(page, per_page, query_params = null) {
  let options = `?page=${page}&per_page=${per_page}`;
  if (query_params != null) {
    options += "&" + query_params;
  }
  return await fetch(PANTRY_ITEMS_ENDPOINT + options, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function postPantryItem(body) {
  return await fetch(PANTRY_ITEMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(body))
  }).then(response => {
    return response;
  });
}

export async function putPantryItem(id, body) {
  return await fetch(PANTRY_ITEMS_ENDPOINT + "/" + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(body))
  }).then(response => {
    return response;
  });
}

export async function deletePantryItem(id) {
  return await fetch(PANTRY_ITEMS_ENDPOINT + "/" + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}
