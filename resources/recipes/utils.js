export function createStar(rating) {
    return `<span  id="star-1" class="fa fa-star ${1 <= rating ? "checked" : ""}" onclick="changeRating(1)"></span>
    <span id="star-2" class="fa fa-star ${2 <= rating ? "checked" : ""}" onclick="changeRating(2)"></span>
    <span id="star-3" class="fa fa-star ${3 <= rating ? "checked" : ""}" onclick="changeRating(3)"></span>
    <span id="star-4" class="fa fa-star ${4 <= rating ? "checked" : ""}" onclick="changeRating(4)"></span>
    <span id="star-5" class="fa fa-star ${5 <= rating ? "checked" : ""}" onclick="changeRating(5)"></span>`;
}

window.changeRating = function (star_num) {
    const star = document.getElementById("star-" + star_num);
    if (star.classList.contains("checked")) {
        let j = star_num;
        if (j != 5 && document.getElementById("star-" + (j + 1)).classList.contains("checked")) {
            j++;
        }
        for (let i = j; i <= 5; i++) {
            document.getElementById("star-" + i).classList.remove("checked");
        }
    } else {
        for (let i = 1; i <= star_num; i++) {
            document.getElementById("star-" + i).classList.add("checked");
        }
    }
}

export function getRating() {
    let rating = 0;
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById("star-" + i).classList.contains("checked")) {
            rating++;
        } else {
            break;
        }
    }
    return rating;
}
