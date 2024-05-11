import { TIME_BEFORE_REDIRECT } from "./constants.js";

export function showMessage(message, is_good) {
  document.getElementById('message').textContent = message;
  if (is_good) {
    document.getElementById('message').style.backgroundColor = "#44ff00";
  } else {
    document.getElementById('message').style.backgroundColor = "#ff7b00";
  }
  document.getElementById('message_parent').style.display = "inline";
}

export function hideElement(id) {
  document.getElementById(id).style.display = "none";
}

export function showElement(id, display = "inline") {
  document.getElementById(id).style.display = display;
}

window.removeElement = function (id) {
  let el = document.getElementById(id);
  el.parentElement.removeChild(el);
}

export function clickButton(button_id) {
  if (document.getElementById(button_id).style.backgroundColor == "rgb(67, 123, 120)") { // if button is pressed
    document.getElementById(button_id).style.backgroundColor = "#b4d6b4";
    return "unpressed";
  } else {
    document.getElementById(button_id).style.backgroundColor = "#437b78";
    return "pressed";
  }
}

export function buttonIsPressed(button_id) {
  return document.getElementById(button_id).style.backgroundColor == "rgb(67, 123, 120)"
}

export function getOrNull(object, key) {
  if (object == null) {
    return null;
  } else {
    let value = object[key] || null;
    if (value == "-") {
      value = null;
    }
    return value;
  }
}

export function redirectToLogin() {
  window.location.href = "/login.html";
}

export function responseIsOk(response) {
  if (!response.ok) {
    if (response.status == 401) {
      redirectToLogin();
      return false;
    }
    return false;
  }
  return true;
}

export function showMessageThenRedirect(message, is_good, redirect) {
  showMessage(message, is_good);
  setTimeout(() => {
    window.location.href = redirect;
  }, TIME_BEFORE_REDIRECT);
}
