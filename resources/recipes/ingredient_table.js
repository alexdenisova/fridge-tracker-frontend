import { v4 as uuidv4 } from 'uuid';
import { INGREDIENT_TABLE_ID } from "./constants";

window.addIngredientRow = function () {
  const table = document.getElementById(INGREDIENT_TABLE_ID);
  table.appendChild(addIngredientRow());
  return false;
};

export function createTable(parsed_ingredients) {
  const table = document.createElement('table');
  table.setAttribute("id", INGREDIENT_TABLE_ID);
  table.innerHTML = `
      <tr>
        <th style="width:10%">Amount</th>
        <th style="width:15%">Unit</th>
        <th>Ingredient</th>
        <th style="width:10%">Optional</th>
      </tr>`;
  const add_ingredient_button = document.createElement('button');
  add_ingredient_button.setAttribute("id", "add_ingredient_button");
  add_ingredient_button.setAttribute("type", "button");
  add_ingredient_button.innerHTML = `Add Ingredient`;
  add_ingredient_button.setAttribute("onclick", `addIngredientRow()`);
  parsed_ingredients.forEach(ingredient => {
    table.appendChild(addIngredientRow(ingredient.amount, ingredient.unit, ingredient.name, ingredient.optional));
  });

  let inner_html = table.outerHTML;
  inner_html += add_ingredient_button.outerHTML;

  return inner_html;
}

export function addIngredientRow(amount = "", unit = "", name = "", optional = false) {
  const tr = document.createElement('tr');
  const tr_id = uuidv4();
  tr.setAttribute("id", tr_id);
  let checked = "";
  if (optional) {
    checked = "checked='checked'";
  }
  tr.innerHTML = `
      <td><input type="text" id="${tr_id}-0" value="${nullToEmpty(amount)}" style="width:65%"></td>
      <td><input type="text" id="${tr_id}-1" value="${nullToEmpty(unit)}" style="width:75%"></td>
      <td><input type="text" id="${tr_id}-2" value="${nullToEmpty(name)}" style="width:94%"></td>
      <td><input type="checkbox" id="${tr_id}-3" ${checked}></td>
      <td><img src="http://findicons.com/files/icons/1715/gion/24/dialog_cancel.png"
      onclick='removeElement("${tr_id}")'></td>`;
  return tr;
}

function nullToEmpty(str) {
  if (str == null) {
    return "";
  }
  return str;
}
