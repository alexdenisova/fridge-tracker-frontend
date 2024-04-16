const LOGIN_ENDPOINT = 'http://localhost:8080/api/login';

export async function postLogin(username) {
  return await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": username,
    }),
  }).then(response => {
    if (response.ok && response.redirected) {
      window.location.href = response.url;
    }
    return response;
  });
}
