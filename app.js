// Elements
const text_input = document.querySelector(".text-input");
const number_input = document.querySelector(".number-input");
const show_expense_container = document.querySelector(
  ".show-expense-container"
);
const input_type = document.querySelectorAll(".radio-button-label input");
const submit_btn = document.querySelector(".submit");
const ctx = document.getElementById("myChart").getContext("2d");

// Data variables
let income_num = 0;
let personal_num = 0;
let travel_num = 0;
let household_num = 0;
let assets_num = 0;
let colorCode;
let expense_item_num;
let expense_container = [];
let colors = ["#2a9d8f", "#d62828", "#ffae12", "#F91B78", "#9163CB"];

// Chart object
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [
      {
        label: "Expenses",
        backgroundColor: [
          "#2a9d8f",
          "#d62828",
          "#ffae12",
          "#F91B78",
          "#9163CB",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "#2a9d8f",
          "#d62828",
          "#ffae12",
          "#F91B78",
          "#9163CB",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Event Listeners
input_type.forEach((input) => {
  input.addEventListener("click", () => {
    expense_item_num = input.value;
  });
});

submit_btn.addEventListener("click", () => {
  let expense_object = {
    text: text_input.value,
    number: number_input.value,
    colorCode: colors[expense_item_num],
    expense_item: expense_item_num
  };
  expense_container.push(expense_object);
  console.log(expense_container);

  createExpense(number_input.value, text_input.value, colors[expense_item_num]);
  let local_storage_expense = JSON.stringify(expense_container);
  localStorage.setItem("local_storage_expense", local_storage_expense);
  clearValues();

  // Update chart
  updateChartData();
});

function showLocalStorageData() {
  let local_storage_expenses = localStorage.getItem("local_storage_expense");

  if (local_storage_expenses) {
    let local_data = JSON.parse(local_storage_expenses);
    expense_container = local_data;
    expense_container.forEach((expense) => {
      createExpense(expense.number, expense.text, expense.colorCode);
    });
  }
}

function createExpense(number, text, colorCode) {
  const create_expense_cont = document.createElement("div");
  create_expense_cont.classList.add("expense");
  create_expense_cont.style.backgroundColor = colorCode;
  show_expense_container.appendChild(create_expense_cont);
  const create_text_div = document.createElement("div");
  create_text_div.classList.add("expense-text");
  create_text_div.innerText = text;
  const create_num_div = document.createElement("div");
  create_num_div.classList.add("expense-num");
  create_num_div.innerText = number;
  create_expense_cont.append(create_num_div, create_text_div);
}

function clearValues() {
  text_input.value = "";
  number_input.value = "";
  input_type.forEach((input) => (input.checked = false));
}

function popuplateNewExpense() {
  expense_container.forEach((expense) => {
    const create_expense_cont = document.createElement("div");
    create_expense_cont.classList.add("expense");
    show_expense_container.appendChild(create_expense_cont);
    const create_num_div = document.createElement("div");
    create_num_div.classList.add("expense-num");
    create_num_div.innerText = expense.number;
    const create_text_div = document.createElement("div");
    create_text_div.classList.add("expense-text");
    create_text_div.innerText = expense.text;

    create_expense_cont.append(create_num_div, create_text_div);
    console.log(expense, "inside expense");
  });
}

function updateChartData() {
  let income = expense_container.filter((expense) => expense.expense_item == 0);
  let personal = expense_container.filter(
    (expense) => expense.expense_item == 1
  );
  let travel = expense_container.filter((expense) => expense.expense_item == 2);
  let household = expense_container.filter(
    (expense) => expense.expense_item == 3
  );
  let assets = expense_container.filter((expense) => expense.expense_item == 4);
  console.log(personal, "personal filter");

  income.forEach((income) => (income_num += parseInt(income.number)));
  personal.forEach((personal) => (personal_num += parseInt(personal.number)));
  travel.forEach((travel) => (travel_num += parseInt(travel.number)));
  household.forEach(
    (household) => (household_num += parseInt(household.number))
  );
  assets.forEach((assets) => (assets_num += parseInt(assets.number)));

  myChart.data.datasets.forEach((dataset) => {
    dataset.data = [
      income_num,
      personal_num,
      travel_num,
      household_num,
      assets_num
    ];
  });
  myChart.update();
}

// Function calls
showLocalStorageData();
updateChartData();
