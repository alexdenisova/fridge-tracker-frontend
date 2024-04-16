const INGREDIENT_ENDPOINT = 'http://localhost:8080/api/ingredients';

export async function getIngredient(ingredient_id) {
  return await fetch(INGREDIENT_ENDPOINT + `/${ingredient_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function getIngredientName(ingredient_id) {
  return await getIngredient(ingredient_id).then(async response => {
    if (!response.ok) {
      return null;
    } else {
      const data = await response.json();
      return data.name;
    }
  });
}

export async function getIngredientId(ingredient_name) {
  return await fetch(INGREDIENT_ENDPOINT + `?name=${ingredient_name}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
    .then(data => {
      if (data.items.length > 0) {
        return data.items[0].id;
      } else {
        return null;
      }
    });
}

export async function postIngredient(ingredient_name, can_be_eaten_raw) {
  return await fetch(INGREDIENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": ingredient_name,
      ...can_be_eaten_raw && { 'can_be_eaten_raw': can_be_eaten_raw },
    })
  }).then(response => {
    return response;
  });
}

export async function putIngredient(ingredient_id, ingredient_name, can_be_eaten_raw) {
  return await fetch(INGREDIENT_ENDPOINT + "/" + ingredient_id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": ingredient_name,
      ...can_be_eaten_raw && { 'can_be_eaten_raw': can_be_eaten_raw },
    })
  }).then(response => {
    return response;
  });
}

// returns ingredient_id
export async function makeIngredientIfNotExists(ingredient_name, can_be_eaten_raw = null) {
  return await getIngredientId(ingredient_name).then(async ingredient_id => {
    if (ingredient_id != null) {
      await putIngredient(ingredient_id, ingredient_name, can_be_eaten_raw);
      return ingredient_id;
    } else {
      const response = await postIngredient(ingredient_name, can_be_eaten_raw);
      if (!response.ok) {
        if (response.status == 401) {
          redirectToLogin();
          return false;
        }
        return null;
      }
      const data = await response.json();
      return data.id;
    }
  })
}
