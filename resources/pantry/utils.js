


// returns map of {amount, weight_grams, volume_milli_litres}
function transformAmount(amount, unit) {
  let result = new Map([]);
  if (amount == null) {
    return result;
  }
  if (unit == "-") {
    result.set("amount", Number(amount))
  } else if (unit == "g") {
    result.set("weight_grams", Number(amount))
  } else if (unit == "ml") {
    result.set("volume_milli_litres", Number(amount))
  }
  return result;
}
