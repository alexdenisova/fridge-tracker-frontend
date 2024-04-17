import { deleteLogin, postLogin } from "./backend/login.js";
import { postUser } from "./backend/users.js";
import { showMessage } from "./utils.js";

var clicked;

window.login = async function (username_id, password_id) {
  const username = document.getElementById(username_id).value;
  const password = document.getElementById(password_id).value;
  if (clicked == "Create") {
    const response = await postUser(username, password);
    if (!response.ok) {
      showMessage("Could not create account", false);
      return false;
    }
  }
  const response = await postLogin(username, password);
  if (!response.ok) {
    showMessage("Wrong username or password", false);
  }
  return false;
}

window.clickSubmit = function (name) {
  clicked = name;
}

window.logout = async function () {
  await deleteLogin();
}
