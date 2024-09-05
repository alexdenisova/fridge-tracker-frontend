import { responseIsOk } from "../utils";
import { CATEGORY_ENDPOINT } from "./constant";


export async function getCategory(category_id) {
  return await fetch(CATEGORY_ENDPOINT + `/${category_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

/// Get ids of categories that contain category_name
export async function listCategories(page, per_page, category_name = null) {
  let options = `?page=${page}&per_page=${per_page}`;
  if (category_name != null) {
    options += `&name=${category_name}`;
  }
  return await fetch(CATEGORY_ENDPOINT + options, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function postCategory(category_name) {
  return await fetch(CATEGORY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": category_name,
    })
  }).then(response => {
    return response;
  });
}

export async function deleteCategory(id) {
  return await fetch(CATEGORY_ENDPOINT + "/" + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    return response;
  });
}

export async function getCategoryName(category_id) {
  return await getCategory(category_id).then(async response => {
    if (!response.ok) {
      return null;
    } else {
      const data = await response.json();
      return data.name;
    }
  });
}

/// Get category id by name
export async function getCategoryId(category_name) {
  return await listCategories(1, 5, category_name).then(async response => {
    if (!response.ok) {
      return null;
    } else {
      const data = await response.json();
      if (data.items.length > 0) {
        return data.items[0].id;
      } else {
        return null;
      }
    }
  });
}


// returns category_id
export async function makeCategoryIfNotExists(category_name) {
  return await getCategoryId(category_name).then(async category_id => {
    if (category_id != null) {
      const response = await getCategory(category_id);
      if (responseIsOk(response)) {
        return category_id;
      } else {
        return null;
      }
    } else {
      const response = await postCategory(category_name);
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
