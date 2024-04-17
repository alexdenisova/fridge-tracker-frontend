import { USERS_ENDPOINT } from "./constant";


export async function postUser(username, password) {
  return await fetch(USERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": username,
      "password": password,
    }),
  }).then(response => {
    return response;
  });
}
