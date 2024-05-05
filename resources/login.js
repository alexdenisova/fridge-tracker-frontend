import { deleteLogin, postLogin } from "./backend/login.js";
import { postUser } from "./backend/users.js";
import { showMessage } from "./utils.js";

window.login = async function (username_id, password_id) {
  const username = document.getElementById(username_id).value;
  const password = document.getElementById(password_id).value;
  const response = await postLogin(username, password);
  if (!response.ok) {
    showMessage("Wrong username or password", false);
  }
  return false;
}

window.createAccount = async function (username_id, password_id) {
  const username = document.getElementById(username_id).value;
  const password = document.getElementById(password_id).value;
  const response = await postUser(username, password);
  if (!response.ok) {
    showMessage("Could not create account", false);
    return false;
  }
  return await login(username_id, password_id);
}

window.demo = async function () {
  const response = await postLogin("demo");
  if (!response.ok) {
    showMessage("Error logging in as demo", false);
  }
  return false;
}

window.logout = async function () {
  await deleteLogin();
}
