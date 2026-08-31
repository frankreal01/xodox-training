const balanceEl = document.getElementById("balance");

const incomeAmountEl = document.getElementById("income-amount");

const expenseAmountEl = document.getElementById("expense-amount");

const transactionListEl = document.getElementById("transaction-list");

const transactionFormEl = document.getElementById("transaction-form");

const descriptionInputEl = document.getElementById("description");

const amountInputEl = document.getElementById("amount");

// Transaction storage
let transactions = getTransactionsFromStorage();

transactionFormEl.addEventListener("submit", addTransaction);

// Add Transaction function
function addTransaction(e) {
    e.preventDefault();

    const description = descriptionInputEl.value;
    const amount = Number(amountInputEl.value.replace(/,/g, ''));

    if (description.trim() === '' || !Number.isFinite(amount) || amount === 0) {
        alert('Please enter a description and a non-zero amount');
        return;
    }

    const transaction = {
        id: generateId(),
        description,
        amount,
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateValues();
    updateLocalStorage();
    transactionFormEl.reset();
    descriptionInputEl.focus();
}




// Update global values
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0);


    // Update DOM Elements
    balanceEl.innerText = formatCurrency(total);
    incomeAmountEl.innerText = formatCurrency(income);
    expenseAmountEl.innerText = formatCurrency(Math.abs(expense));
}

// Create a unique ID for each transaction.
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Add one transaction item to the list in the page.
function addTransactionToDOM(transaction) {
    const item = document.createElement('li');
    const sign = transaction.amount < 0 ? '-' : '+';

    item.classList.add('transaction');
    item.classList.add(transaction.amount < 0 ? 'expense' : 'income');

    item.innerHTML = `
        <span>${escapeHtml(transaction.description)}</span>
        <div>
            <span>${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
            <button class="delete-btn" type="button" aria-label="Delete ${escapeHtml(transaction.description)}">×</button>
        </div>
    `;

    item.querySelector('.delete-btn').addEventListener('click', () => removeTransaction(transaction.id));
    transactionListEl.appendChild(item);
}

// Remove a transaction, save the new list, and redraw the page.
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactionsFromStorage() {
    try {
        const savedTransactions = JSON.parse(localStorage.getItem('transactions'));
        return Array.isArray(savedTransactions) ? savedTransactions : [];
    } catch {
        return [];
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Prevent user text from being treated as HTML when it is displayed.
function escapeHtml(text) {
    const element = document.createElement('div');
    element.textContent = text;
    return element.innerHTML;
}

// Draw saved transactions when the page first loads.
function init() {
    transactionListEl.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

