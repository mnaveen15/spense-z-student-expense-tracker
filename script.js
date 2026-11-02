// Spense-Z - Student Expense Tracker
// JavaScript Mini Project

let expenses = [
  { name: "Lunch", amount: 120, category: "Food" },
  { name: "Bus Pass", amount: 80, category: "Travel" },
  { name: "Notebook", amount: 150, category: "Education" }
];

const form = document.getElementById("expenseForm");
const nameInput = document.getElementById("expenseName");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const list = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");
const totalAmount = document.getElementById("totalAmount");
const transactionCount = document.getElementById("transactionCount");
const averageAmount = document.getElementById("averageAmount");
const filterCategory = document.getElementById("filterCategory");
const filterInfo = document.getElementById("filterInfo");
const analyticsText = document.getElementById("analyticsText");
const message = document.getElementById("message");

const formatMoney = (amount) => `₹${amount.toFixed(2)}`;

// Regular function: calculate total using a loop.
function calculateTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total += items[i].amount;
  }

  return total;
}

// switch: give a simple category description.
function categoryDescription(category) {
  switch (category) {
    case "Food": return "Daily food expense";
    case "Travel": return "College/travel expense";
    case "Shopping": return "Shopping expense";
    case "Education": return "Study-related expense";
    case "Entertainment": return "Entertainment expense";
    default: return "Other expense";
  }
}

// forEach + map: render the expense list.
function renderExpenses(items = expenses) {
  list.innerHTML = "";

  if (items.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  items.forEach((expense, index) => {
    const row = document.createElement("div");
    row.className = "expense";

    row.innerHTML = `
      <div>
        <div class="expense-name">${escapeHTML(expense.name)}</div>
        <div class="expense-meta">${escapeHTML(expense.category)} • ${categoryDescription(expense.category)}</div>
      </div>
      <div class="expense-right">
        <span class="amount">${formatMoney(expense.amount)}</span>
        <button class="delete" onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;

    list.appendChild(row);
  });

  updateSummary();
}

// filter(): isolate expenses by category.
function applyFilter() {
  const category = filterCategory.value;

  if (category === "All") {
    filterInfo.textContent = "Showing all expenses";
    renderExpenses(expenses);
    return;
  }

  const filtered = expenses.filter((expense) => expense.category === category);
  filterInfo.textContent = `Showing ${filtered.length} ${category} expense(s)`;
  renderExpenses(filtered);
}

// map(): create a transformed report.
function createReport(items) {
  return items.map((expense) => `${expense.name.toUpperCase()}: ₹${expense.amount}`);
}

function updateSummary() {
  const total = calculateTotal(expenses);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;

  totalAmount.textContent = formatMoney(total);
  transactionCount.textContent = count;
  averageAmount.textContent = formatMoney(average);

  const report = createReport(expenses);

  analyticsText.innerHTML = `
    <p><strong>Total:</strong> ${formatMoney(total)}</p>
    <p><strong>Average:</strong> ${formatMoney(average)}</p>
    <p><strong>Report:</strong> ${report.length ? report.join(" • ") : "No expenses"}</p>
  `;
}

function deleteExpense(index) {
  // break/continue are not needed for deletion; filter creates the new array.
  expenses = expenses.filter((_, i) => i !== index);
  applyFilter();
  showMessage("Expense deleted.");
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = "";
  }, 2000);
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  // if...else validation
  if (name === "") {
    showMessage("Please enter an expense name.");
    return;
  } else if (Number.isNaN(amount) || amount <= 0) {
    showMessage("Please enter a valid amount.");
    return;
  }

  expenses.push({
    name: name,
    amount: amount,
    category: category
  });

  form.reset();
  applyFilter();
  showMessage("Expense added successfully.");
});

filterCategory.addEventListener("change", applyFilter);

document.getElementById("affordableBtn").addEventListener("click", () => {
  const affordable = expenses.filter((expense) => expense.amount < 200);

  if (affordable.length === 0) {
    filterInfo.textContent = "No expenses under ₹200";
  } else {
    filterInfo.textContent = `Expenses under ₹200: ${affordable.length}`;
  }

  renderExpenses(affordable);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const confirmed = confirm("Clear all expenses?");

  if (confirmed) {
    expenses = [];
    filterCategory.value = "All";
    applyFilter();
    showMessage("All expenses cleared.");
  }
});

// Initial display
renderExpenses();
