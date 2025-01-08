document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const expenseSummary = document.getElementById("expense-summary");
    const expenseChartCanvas = document.getElementById("expense-chart");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let expenseChart;

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = { id: Date.now(), name, amount, category, date };

        expenses.push(expense);
        saveToLocalStorage();
        updateUI();
        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            saveToLocalStorage();
            updateUI();
        } else if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(exp => exp.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(exp => exp.id !== id);
            saveToLocalStorage();
            updateUI();
        }
    });

    filterCategory.addEventListener("change", () => {
        updateUI();
    });

    function updateUI() {
        const categoryFilter = filterCategory.value;
        const filteredExpenses =
            categoryFilter === "All"
                ? expenses
                : expenses.filter(exp => exp.category === categoryFilter);

        displayExpenses(filteredExpenses);
        updateTotalAmount(filteredExpenses);
        updateExpenseSummary();
        updatePieChart();
    }

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount(expenses) {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function updateExpenseSummary() {
        const summary = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        expenseSummary.innerHTML = "";

        for (const [category, total] of Object.entries(summary)) {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = `${category}: $${total.toFixed(2)}`;
            expenseSummary.appendChild(listItem);
        }
    }

    function updatePieChart() {
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
    
        const categories = Object.keys(categoryTotals);
        const totals = Object.values(categoryTotals);
    
        // Check if there's data to display
        if (categories.length > 0) {
            expenseChartCanvas.style.display = "block"; // Show the chart canvas
        } else {
            expenseChartCanvas.style.display = "none"; // Hide the chart canvas if no data
            return; // Exit the function if no data
        }
    
        if (expenseChart) {
            expenseChart.destroy(); // Destroy the existing chart before creating a new one
        }
    
        expenseChart = new Chart(expenseChartCanvas, {
            type: "pie",
            data: {
                labels: categories,
                datasets: [
                    {
                        label: "Expense Categories",
                        data: totals,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                        ],
                        borderWidth: 1,
                        borderColor: "#fff",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
            },
        });
    }
    
    function saveToLocalStorage() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Initialize the UI with stored data
    updateUI();

    // Add prediction form and logic
   // Prediction button and input elements
const predictButton = document.getElementById("predict-button");
const predictionMonthsInput = document.getElementById("prediction-months");
const predictionResult = document.getElementById("prediction-result");

predictButton.addEventListener("click", () => {
    const monthsAhead = parseInt(predictionMonthsInput.value);
    if (!monthsAhead || monthsAhead <= 0) {
        predictionResult.textContent = "Please enter a valid number of months.";
        return;
    }

    const predictedExpenses = predictFutureExpenses(expenses, monthsAhead);

    predictionResult.innerHTML = `
        <h4>Predicted Expenses for ${monthsAhead} Month(s):</h4>
        <ul>
            ${Object.entries(predictedExpenses)
                .map(([category, total]) => `<li>${category}: $${total.toFixed(2)}</li>`)
                .join("")}
        </ul>
    `;
});

// Function to calculate future predictions
function predictFutureExpenses(expenses, monthsAhead) {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = acc[expense.category] || [];
        acc[expense.category].push(expense.amount);
        return acc;
    }, {});

    const predictedExpenses = {};
    for (const [category, amounts] of Object.entries(categoryTotals)) {
        const total = amounts.reduce((sum, value) => sum + value, 0);
        const avg = total / amounts.length;
        predictedExpenses[category] = avg * monthsAhead;
    }

    return predictedExpenses;
}

});