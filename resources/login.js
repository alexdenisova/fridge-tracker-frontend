import { postLogin } from "./backend/login.js";
import { showMessage } from "./utils.js";

window.login = async function (username_id) {
  const username = document.getElementById(username_id).value;
  const response = await postLogin(username);
  if (!response.ok) {
    showMessage("Wrong username", false);
  }
  return false;
}
