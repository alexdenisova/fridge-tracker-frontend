import { makeIngredientIfNotExists } from "../backend/ingredients.js";
import { postPantryItem } from "../backend/pantry_items.js";
import { clickButton, getOrNull, hideElement, showElement, showMessage, showMessageThenRedirect } from "../utils.js";
import { LIST_ID, UNIT_ID, main } from "./constants.js";
import { transformAmount, unitOptions } from "./utils.js";

export const ADD_ID = "add_pantry_item_form";

// window.addPantryItemButton = function (add_id) {
//   if (clickButton(add_id) == "unpressed") {
//     hideElement(ADD_ID);
//     showElement(LIST_ID);
//   } else {
//     hideElement(LIST_ID);
//     if (document.getElementById(ADD_ID) == null) {
//       addForm();
//     } else {
//       showElement(ADD_ID, "block");
//     }
//   }
// }

// function addForm() {
//   const div = document.createElement("div");
//   div.setAttribute("class", "form");
//   div.setAttribute("id", ADD_ID);
//   const select = unitOptions();
//   div.innerHTML = `
//     <div class="form-heading">Provide pantry item information</div>
//     <form onsubmit="submitPantryItem(); return false;">
//       <label for="ingredient_name"><span>Ingredient Name<span class="required">*</span></span><input type="text" class="input-field" id="ingredient_name" name="ingredient_name"></label>
//       <label for="purchase_date"><span>Purchase Date</span><input type="date" class="input-field" id="purchase_date" name="purchase_date" placeholder="YYYY-MM-DD"></label>
//       <label for="expiration_date"><span>Expiraton Date</span><input type="date" class="input-field" id="expiration_date" name="expiration_date" placeholder="YYYY-MM-DD"></label>
//       <label for="amount"><span>Amount</span><input type="text" class="input-field" id="amount" name="amount" style="width:30%;">${select.outerHTML}</label>
//       <label for="running_low"><span>Running low at</span><input type="text" class="input-field" id="running_low" name="running_low" style="width:30%;"></label>
//       <label for="essential"><span>Essential</span><input type="checkbox" class="input-checkbox" id="essential"></label>
//       <label><span> </span><input type="submit" value="Submit"></label>
//     </form>`;
//   main.appendChild(div);
// }

// window.submitPantryItem = async function () {
//   const name = document.getElementById('ingredient_name').value;
//   const purchase_date = document.getElementById('purchase_date').value;
//   const expiration_date = document.getElementById('expiration_date').value;
//   const essential = document.getElementById('essential').checked;

//   const amount = getOrNull(document.getElementById('amount'), "value");
//   const running_low = getOrNull(document.getElementById('running_low'), "value");
//   if (isNaN(amount) && amount != null || isNaN(running_low) && running_low != null) {
//     showMessage("Amount must be a number or none", false);
//     return false;
//   }
//   const unit_options = document.getElementById(UNIT_ID);
//   let unit = unit_options.options[unit_options.selectedIndex].text;
//   let map = transformAmount(amount, unit);

//   const ingredient_id = await makeIngredientIfNotExists(name);
//   let new_map = new Map(Object.entries({
//     ...purchase_date && { 'purchase_date': purchase_date },
//     ...expiration_date && { 'expiration_date': expiration_date },
//     ...ingredient_id && { 'ingredient_id': ingredient_id },
//     ...running_low && { 'running_low': Number(running_low) },
//     'essential': essential,
//   }));
//   map = new Map([...map, ...new_map])

//   const response = await postPantryItem(map);
//   if (response.ok) {
//     showMessageThenRedirect("Pantry item added successfully!", true, "pantry.html");
//   } else {
//     if (response.status == 401) {
//       redirectToLogin();
//     }
//     showMessage("Failed to create pantry item!", false);
//   }
//   return false;
// }
