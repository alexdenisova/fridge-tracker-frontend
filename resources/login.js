import { deleteLogin, postLogin } from "./backend/login.js";
import { postUser } from "./backend/users.js";
import { showMessage } from "./utils.js";

const LOGIN_TITLE_ID = "login-title";
const LOGIN_ERROR_ID = "login-error";
const MAIN_BUTTON_ID = "main-button";
const SECONDARY_BUTTON_ID = "secondary-button";

const togglePassword = document.getElementById("togglePassword");
if (togglePassword != null) {
  togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
  });
}

window.login = async function (username_id, password_id) {
  const username = document.getElementById(username_id).value;
  const password = document.getElementById(password_id).value;
  const response = await postLogin(username, password);
  if (!response.ok) {
    switch (response.status) {
      case 404:
        document.getElementById(LOGIN_ERROR_ID).innerText = 'Username not found.';
        break;
      case 401:
        document.getElementById(LOGIN_ERROR_ID).innerText = 'Wrong password.';
        break;
      default:
        document.getElementById(LOGIN_ERROR_ID).innerText = 'Unknown error.';
    }
    document.getElementById(LOGIN_ERROR_ID).style.visibility = "visible";
  }
  return false;
}

window.createAccount = async function (username_id, password_id) {
  const username = document.getElementById(username_id).value;
  const password = document.getElementById(password_id).value;
  const response = await postUser(username, password);
  if (!response.ok) {
    switch (response.status) {
      case 409:
        document.getElementById(LOGIN_ERROR_ID).innerText = 'Username already exists.';
        break;
      default:
        document.getElementById(LOGIN_ERROR_ID).innerText = 'Unknown error.';
    }
    document.getElementById(LOGIN_ERROR_ID).style.visibility = "visible";
    return false;
  }
  return await login(username_id, password_id);
}

window.secondaryButton = async function () {
  const login_msg = "Login Here";
  const sign_up_msg = "Sign Up";
  if (document.getElementById(LOGIN_TITLE_ID).innerText == login_msg) {
    document.getElementById(LOGIN_TITLE_ID).innerText = sign_up_msg;
    document.getElementById(MAIN_BUTTON_ID).innerText = sign_up_msg;
    document.getElementById(MAIN_BUTTON_ID).setAttribute("onclick", "createAccount('username', 'password');");
    document.getElementById(SECONDARY_BUTTON_ID).innerText = "Login";
  } else {
    document.getElementById(LOGIN_TITLE_ID).innerText = login_msg;
    document.getElementById(MAIN_BUTTON_ID).innerText = "Log In";
    document.getElementById(MAIN_BUTTON_ID).setAttribute("onclick", "login('username', 'password');");
    document.getElementById(SECONDARY_BUTTON_ID).innerText = "Sign up";
  }
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
