const RECIPE_INGREDIENT_ENDPOINT = 'http://localhost:8081/recipe_ingredients';

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
    if (!response.ok) {
      return null;
    } else {
      return response.json();
    }
  });
}
