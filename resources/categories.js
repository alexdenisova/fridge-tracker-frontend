const ul = document.getElementById("categories-list"),
  input = document.getElementById("categories");

let maxTags = 10,
  tags = ["Webster", "CSS"];


export function createTag() {
  ul.querySelectorAll("li").forEach((li) => li.remove());
  tags
    .slice()
    .reverse()
    .forEach((tag) => {
      let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
      ul.insertAdjacentHTML("afterbegin", liTag);
    });
}



// function addTag(e) {
//   if (e.key == "Enter") {
//     let tag = e.target.value.replace(/\s+/g, " ");
//     if (tag.length > 1 && !tags.includes(tag)) {
//       if (tags.length < 10) {
//         tag.split(",").forEach((tag) => {
//           tags.push(tag);
//           createTag();
//         });
//       }
//     }
//     e.target.value = "";
//   }
// }



// const removeBtn = document.querySelector(".details button");
// removeBtn.addEventListener("click", () => {
//   tags.length = 0;
//   ul.querySelectorAll("li").forEach((li) => li.remove());
// });
