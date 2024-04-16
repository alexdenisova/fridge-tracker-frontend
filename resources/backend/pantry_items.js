import { TEST_USER_ID } from "../constants.js";

const PANTRY_ITEMS_ENDPOINT = 'http://localhost:8080/api/pantry_items';

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

export async function listPantryItems(query_params = null) {
  let url = PANTRY_ITEMS_ENDPOINT;
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

export async function postPantryItem(ingredient_id, purchase_date = null, expiration_date = null, quantity = null, weight_grams = null, volume_milli_litres = null, user_id = TEST_USER_ID) {
  return await fetch(PANTRY_ITEMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "ingredient_id": ingredient_id,
      "user_id": user_id,
      ...purchase_date && { 'purchase_date': purchase_date },
      ...expiration_date && { 'amount': expiration_date },
      ...quantity && { 'quantity': Number(quantity) },
      ...weight_grams && { 'weight_grams': Number(weight_grams) },
      ...volume_milli_litres && { 'volume_milli_litres': Number(volume_milli_litres) },
    })
  }).then(response => {
    return response;
  });
}

export async function putPantryItem(id, ingredient_id, purchase_date = null, expiration_date = null, quantity = null, weight_grams = null, volume_milli_litres = null, user_id = TEST_USER_ID) {
  return await fetch(PANTRY_ITEMS_ENDPOINT + "/" + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "ingredient_id": ingredient_id,
      "user_id": user_id,
      ...purchase_date && { 'purchase_date': purchase_date },
      ...expiration_date && { 'amount': expiration_date },
      ...quantity && { 'quantity': Number(quantity) },
      ...weight_grams && { 'weight_grams': Number(weight_grams) },
      ...volume_milli_litres && { 'volume_milli_litres': Number(volume_milli_litres) },
    })
  }).then(response => {
    return response;
  });
}
