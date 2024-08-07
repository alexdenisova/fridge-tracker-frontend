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

export function pagination(path, total_pages, current_page) {
  current_page = Number(current_page);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  if (current_page != 1) {
    pagination.innerHTML = `<a href="${path}?page=${current_page - 1}">&laquo;</a>`; // this shifts the page bar left
  }
  if (total_pages <= 7) {
    for (var i = 1; i <= total_pages; i++) {
      console.log(total_pages + " " + current_page);
      if (i != current_page) {
        pagination.innerHTML += `<a href="${path}?page=${i}">${i}</a>`;
      } else {
        pagination.innerHTML += `<a href="${path}?page=${i}" class="active">${i}</a>`;
      }
    }
  } else {
    if (current_page == 1) {
      pagination.innerHTML += `<a href="${path}?page=1" class="active">1</a>`;
    } else {
      pagination.innerHTML += `<a href="${path}?page=1">1</a>`;
    }

    if (current_page > 3) {
      pagination.innerHTML += `<a href="" class="dot-dot">..</a>`;
    }
    if (current_page > 2) {
      pagination.innerHTML += `<a href="${path}?page=${current_page - 1}">${current_page - 1}</a>`;
    }
    if (current_page != 1 && current_page != total_pages) {
      pagination.innerHTML += `<a href="${path}?page=${current_page}" class="active">${current_page}</a>`;
    }
    if (current_page < total_pages - 1) {
      pagination.innerHTML += `<a href="${path}?page=${current_page + 1}">${current_page + 1}</a>`;
    }
    if (current_page < total_pages - 2) {
      pagination.innerHTML += `<a href="" class="dot-dot">..</a>`;
    }
    if (current_page == total_pages) {
      pagination.innerHTML += `<a href="${path}?page=${total_pages}" class="active">${total_pages}</a>`;
    } else {
      pagination.innerHTML += `<a href="${path}?page=${total_pages}">${total_pages}</a>`;
    }
  }
  if (current_page != total_pages) {
    console.log(current_page + 1);
    pagination.innerHTML += `<a href="${path}?page=${current_page + 1}">&raquo;</a>`; // this shifts the page bar left
  }
}
