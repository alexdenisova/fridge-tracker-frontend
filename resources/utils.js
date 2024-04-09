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
