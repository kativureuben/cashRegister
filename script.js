function checkCashRegister(price, cash, cid) {
  const currencyUnits = [
    ["PENNY", 0.01],
    ["NICKEL", 0.05],
    ["DIME", 0.1],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100]
  ];
  
  // Calculate the total change required
  let changeDue = cash - price;
  
  // Calculate the total cash in drawer
  let totalCid = cid.reduce((total, denom) => total + denom[1], 0).toFixed(2);
  
  // Handle cases where the total cash in drawer is less than change due
  if (parseFloat(totalCid) < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  
  // Handle cases where the total cash in drawer is exactly equal to change due
  if (parseFloat(totalCid) === changeDue) {
    return { status: "CLOSED", change: cid };
  }
  
  // Array to store the change to give back to the customer
  let changeArray = [];
  
  // Loop through the currency units from highest to lowest
  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let currencyName = currencyUnits[i][0];
    let currencyValue = currencyUnits[i][1];
    
    let currencyAmountInDrawer = cid[i][1];
    let currencyToReturn = 0;
    
    // While there is enough change due and there is still enough of this currency in the drawer
    while (changeDue >= currencyValue && currencyAmountInDrawer >= currencyValue) {
      // Subtract the currency value from the change due
      changeDue -= currencyValue;
      // Subtract the currency value from the drawer
      currencyAmountInDrawer -= currencyValue;
      // Add this currency to the amount we will return
      currencyToReturn += currencyValue;
      // Round changeDue to avoid floating-point precision issues
      changeDue = changeDue.toFixed(2);
    }
    
    // If we added any of this currency to the change, push it to the changeArray
    if (currencyToReturn > 0) {
      changeArray.push([currencyName, currencyToReturn]);
    }
  }
  
  // If we couldn't provide exact change, return INSUFFICIENT_FUNDS
  if (changeDue > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  
  // Return the change and the status "OPEN"
  return { status: "OPEN", change: changeArray };
}

// Test cases
console.log(checkCashRegister(19.5, 20, [
  ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1],
  ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55],
  ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]
]));
