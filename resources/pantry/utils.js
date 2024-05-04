import { UNIT_OPTIONS } from "./constants";

// creates unit select button
export function unitOptions() {
  const select = document.createElement('select');
  select.setAttribute("id", "edit_unit");
  for (let i = 0; i < UNIT_OPTIONS.length; i++) {
    const opt = document.createElement('option');
    opt.value = UNIT_OPTIONS[i];
    opt.innerHTML = UNIT_OPTIONS[i];
    select.appendChild(opt);
  }
  return select;
}


// returns map of {amount, weight_grams, volume_milli_litres}
export function transformAmount(amount, unit) {
  let result = new Map([]);
  if (amount == null) {
    return result;
  }
  if (unit == "-") {
    result.set("quantity", Number(amount))
  } else if (unit == "g") {
    result.set("weight_grams", Number(amount))
  } else if (unit == "ml") {
    result.set("volume_milli_litres", Number(amount))
  }
  return result;
}

export function expirationDate(expiration_date) {
  if (expiration_date == null) {
    return "-";
  }
  const exp = Date.parse(expiration_date);
  const now = new Date();
  const days_left = Math.ceil((exp - now) / 60 / 60 / 24 / 1000);
  if (days_left < 0) {
    return "EXPIRED";
  } else if (days_left == 1) {
    return "in 1 day";;
  } else if (days_left <= 7) {
    return "in " + days_left + " days";
  } else {
    return expiration_date;
  }
}
