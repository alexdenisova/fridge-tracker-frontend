export const TAGS_LIST = "categories-list";
export const TAGS_INPUT = "categories";

export function createTag(tag) {
  const ul = document.getElementById(TAGS_LIST);
  let liTag = `<li>${tag} <i class="fa fa-times" aria-hidden="true" onclick="remove(this)"></i></li>`;
  ul.lastChild.insertAdjacentHTML('beforebegin', liTag)
}

export function getTags() {
  const ul = document.getElementById(TAGS_LIST);
  var tags = [];
  for (const li of ul.querySelectorAll("li")) {
    tags.push(li.innerText.trim());
  };
  return tags;
}

function addTag(e) {
  if (e.key == "Enter") {
    let tag = e.target.value.replace(/\s+/g, " ");
    const tags = getTags();
    if (tag.length > 1 && !tags.includes(tag)) {
      if (tags.length < 10) {
        tag.split(",").forEach((tag) => {
          createTag(tag);
        });
      }
    }
    e.target.value = "";
  }
}

export function addCategoryListener() {
  const input = document.getElementById(TAGS_INPUT);
  input.addEventListener("keyup", addTag);
}
