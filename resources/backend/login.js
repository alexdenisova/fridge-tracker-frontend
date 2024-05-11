import { LOGIN_ENDPOINT } from "./constant";


export async function postLogin(username, password = null) {
  return await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": username,
      ...password && { 'password': password },
    }),
  }).then(response => {
    if (response.ok && response.redirected) {
      window.location.href = response.url;
    }
    return response;
  });
}

export async function deleteLogin() {
  return await fetch(LOGIN_ENDPOINT, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(response => {
    if (response.ok && response.redirected) {
      window.location.href = response.url;
    }
    return response;
  });
}