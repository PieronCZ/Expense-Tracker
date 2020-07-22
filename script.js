const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('You have to specify both amount and text');
    } else {
        const transaction = {
            id: transactions.length ? transactions[transactions.length-1].id + 1:1,
            text: text.value,
            amount: +amount.value
        };
        transactions.push(transaction);

        addTransactionDOM(transaction);
        counter();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  // Create new element
  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

  // Adding to DOM
  list.appendChild(item);
}

// Count expenses, incomes and total and uopdate DOM
function counter() {
  // Create array with amounts
  const amounts = transactions.map((transaction) => transaction.amount);

  // Count total
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  // Count income
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  // Count expanse
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  // Add to DOM
  money_minus.innerText = `$${expense}`;
  money_plus.innerText = `$${income}`;
  balance.innerText = `$${total}`;
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  counter();
}

init();

// Event listeners
form.addEventListener('submit', addTransaction);
