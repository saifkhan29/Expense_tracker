// Elements
const text_input = document.querySelector(".text-input");
const number_input = document.querySelector(".number-input");
const show_expense_container = document.querySelector(
  ".show-expense-container"
);
const input_type = document.querySelectorAll(".radio-button-label input");
const submit_btn = document.querySelector(".submit_main");
const ctx = document.getElementById("myChart").getContext("2d");
const popup_container = document.querySelector(".popup-container");
const popup_yes_btn = document.querySelector(".button-container .yes");
const popup_no_btn = document.querySelector(".button-container .no");
const clear_data_btn = document.querySelector(".clear-data-btn");
const clear_data_cont = document.querySelector(".clear-data-cont");
const clear_yes_btn = document.querySelector(".clear-data-cont .clear_yes");
const clear_no_btn = document.querySelector(".clear-data-cont .clear_no");

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
let delete_btn;
let current_idx_delete;

// Chart object
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Income", "Personal Expense", "Travelling", "Household", "Assets"],
    datasets: [
      {
        label: "Expenses",
        backgroundColor: [
          "#2a9d8f",
          "#d62828",
          "#ffae12",
          "#F91B78",
          "#9163CB",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "#2a9d8f",
          "#d62828",
          "#ffae12",
          "#F91B78",
          "#9163CB",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Event Listeners
input_type.forEach((input) => {
  input.addEventListener("click", () => {
    expense_item_num = input.value;
  });
});

submit_btn.addEventListener("click", () => {
  if (number_input.value > 0 && text_input.value.length > 0) {
    let expense_object = {
      text: text_input.value,
      number: number_input.value,
      colorCode: colors[expense_item_num],
      expense_item: expense_item_num,
    };
    expense_container.push(expense_object);

    createExpense(
      number_input.value,
      text_input.value,
      colors[expense_item_num]
    );
    setLocalStorage();

    clearValues();

    // Update chart
    updateChartData();
  }
});

popup_no_btn.addEventListener("click", () => {
  popup_container.classList.add("hide");
});

popup_yes_btn.addEventListener("click", () => {
  expense_container = expense_container.filter((expenses, idx) => {
    if (idx != current_idx_delete) {
      return expenses;
    }
  });
  console.log(expense_container);
  let expenses = document.querySelectorAll(".expense");
  expenses[current_idx_delete].remove();
  popup_container.classList.add("hide");
  setLocalStorage();
});

clear_data_btn.addEventListener("click", () => {
  clear_data_cont.classList.remove("hide");
});

clear_no_btn.addEventListener("click", () => {
  clear_data_cont.classList.add("hide");
});
clear_yes_btn.addEventListener("click", () => {
  localStorage.removeItem("local_storage_expense");
  let expenses = document.querySelectorAll(".expense");
  expenses.forEach((expense) => expense.remove());
  clear_data_cont.classList.add("hide");
});

function setLocalStorage() {
  let local_storage_expense = JSON.stringify(expense_container);
  localStorage.setItem("local_storage_expense", local_storage_expense);
}

function showLocalStorageData() {
  let local_storage_expenses = localStorage.getItem("local_storage_expense");

  if (local_storage_expenses) {
    let local_data = JSON.parse(local_storage_expenses);
    expense_container = local_data;
    expense_container.forEach((expense) => {
      createExpense(expense.number, expense.text, expense.colorCode);
    });
    delete_btn_handler();
  }
}

function delete_btn_handler() {
  delete_btn = document.querySelectorAll(".delete-icon");
  delete_btn.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      console.log("delete btn clicked");
      current_idx_delete = idx;
      popup_container.classList.remove("hide");
    });
  });
  // delete_btn.addEventListener('click', () => {
  //   console.log('delete btn clicked')
  //   popup_container.classList.remove('hide')
  // })
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
  delete_icon = document.createElement("img");
  delete_icon.src = "https://user-images.githubusercontent.com/79800224/248540537-dea37626-a00d-402b-b006-922e355d7f24.png";
  delete_icon.classList.add("delete-icon");
  create_expense_cont.append(create_num_div, create_text_div, delete_icon);
  delete_btn_handler();
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
      assets_num,
    ];
  });
  myChart.update();
}

// Function calls
showLocalStorageData();
updateChartData();
