const INGREDIENT_ENDPOINT = 'http://localhost:8081/ingredients';

export async function getIngredientName(ingredient_id) {
  return await fetch(INGREDIENT_ENDPOINT + `/${ingredient_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    if (!response.ok) {
      return null;
    } else {
      return response.json();
    }
  }).then(data => {
    return data.name;
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

export async function postIngredient(ingredient_name) {
  return await fetch(INGREDIENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": ingredient_name,
    })
  }).then(response => {
    if (!response.ok) {
      return null;
    } else {
      return response.json();
    }
  });
}

// returns ingredient_id
export async function createIngredientIfNotExists(ingredient_name) {
  return await getIngredientId(ingredient_name).then(async ingredient_id => {
    if (ingredient_id != null) {
      return ingredient_id;
    } else {
      return (await postIngredient(ingredient_name)).id
    }
  })
}
