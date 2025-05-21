const today = new Date();

const weekday = today.toLocaleDateString(navigator.language || "ru-RU", {
  weekday: "long",
});
const dayMonth = today.toLocaleDateString(navigator.language || "ru-RU", {
  day: "numeric",
  month: "long",
});

document.getElementById("weekday").textContent =
  weekday.charAt(0).toUpperCase() + weekday.slice(1);
document.getElementById("daymonth").textContent = dayMonth;

/*=========modal переменные=======*/
const addBtn = document.querySelector(".add_btn");
const modal = document.querySelector(".modal");
const modalSwipe = document.querySelector(".swipe_indicator");
const modalAddBtn = document.querySelector(".modal_btn_first");
const modalResetBtn = document.querySelector(".modal_btn_second");
const modalInpAdd = document.querySelector(".modal_input_add");
const modalInpDate = document.querySelector(".modal_input_date");
const modalForm = document.querySelector(".modal_form_btn");
const statusMessage = document.querySelector(".error_message");
const listTodo = document.querySelector(".list");
const overwiev = document.querySelector(".overwiev");

const buttons = document.querySelectorAll(".button_styles");

/*=========кнопки статуса переменные=======*/
const container = document.querySelector(".container");
const statuses = document.querySelector(".statuses");

/*===========modal swipe ================*/
const now = new Date();
const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);

modalInpDate.min = localISOTime;

let originalStatusesContent = statuses.innerHTML;

let counter = parseInt(localStorage.getItem("counter")) || 0;

const todoList = JSON.parse(localStorage.getItem("list")) || [];
renderTodos();
initStatusButtons();

function openModal() {
  addBtn.style.display = "none";
  modal.style.display = "block";
  modal.classList.add("show");
  statuses.innerHTML = '<p style="padding: 9px 0px;">Список дел:</p>';
  statusMessage.textContent = "";
  overwiev.style.display = "block";
}

function closeModal() {
  addBtn.style.display = "block";
  modal.classList.remove("show");
  modal.style.display = "none";
  statuses.style.display = "flex";
  statuses.innerHTML = originalStatusesContent;
  initStatusButtons();
  overwiev.style.display = "none";
}

function showStatusMessage(text) {
  statusMessage.textContent = text;
  statusMessage.style.display = "block";

  setTimeout(() => {
    statusMessage.style.display = "block";
    statusMessage.textContent = "";
  }, 5000);
}

addBtn.addEventListener("click", openModal);

modalSwipe.addEventListener("click", closeModal);

overwiev.addEventListener("click", closeModal);

/*=======modal inputs ===============*/

modalInpDate.addEventListener("click", () => {
  modalInpDate.showPicker?.();
});

function renderTodoItem(todo) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("list_style");
  todoItem.setAttribute("data-id", todo.id);

  const formattedDate = new Date(todo.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  const time = todo.time || "";
  const fullDateTime = `${formattedDate}, ${time}`;

  todoItem.innerHTML = `
    <label>
      <input
        class="checkbox_style"
        type="checkbox"
        name="checked"
        value="yes"
        ${todo.completed ? "checked" : ""}
      />
    </label>
    <div class="todo">
      <p class="when_todo">${fullDateTime}</p>
      <p class="what_todo">${todo.title}</p>
    </div>
  `;

  listTodo.appendChild(todoItem);

  if (todo.completed) {
    const todoWhen = todoItem.querySelector(".when_todo");
    const todoWhat = todoItem.querySelector(".what_todo");

    todoWhen.style.color = "rgba(29, 27, 30, 0.50)";
    todoWhat.style.color = "rgba(29, 27, 30, 0.50)";
    todoWhat.style.textDecoration = "line-through";
  }

  localStorage.setItem("list", JSON.stringify(todoList));
}
function renderTodos() {
  listTodo.innerHTML = "";

  if (todoList.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Ваш список пока пуст";
    emptyMessage.classList.add("empty_message");
    listTodo.appendChild(emptyMessage);
  } else {
    const emptyMessage = listTodo.querySelector(".empty_message");
    if (emptyMessage) {
      emptyMessage.remove();
    }

    todoList.forEach((todo) => renderTodoItem(todo));
  }

  checkEmptyListAndShowMessage();
}

modalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = modalInpAdd.value;
  const dateTimeValue = modalInpDate.value;

  if (!title || !dateTimeValue) {
    showStatusMessage("Заполните пожалуйста все поля");
    return;
  }

  const [date, time] = dateTimeValue.split("T");

  const newTodo = {
    id: `todo_${++counter}`,
    title,
    completed: false,
    date,
    time,
  };

  todoList.push(newTodo);
  localStorage.setItem("list", JSON.stringify(todoList));
  localStorage.setItem("counter", counter);

  renderTodos();

  modalInpAdd.value = "";
  modalInpDate.value = "";
});

modalResetBtn.addEventListener("click", () => {
  modalInpAdd.value = "";
  modalInpDate.value = "";
  statusMessage.textContent = "";
  statusMessage.style.display = "none";
  closeModal();
});

listTodo.addEventListener("click", (event) => {
  if (event.target.classList.contains("checkbox_style")) {
    const todoItem = event.target.closest(".list_style");
    const todoId = todoItem.getAttribute("data-id");

    const todo = todoList.find((el) => el.id === todoId);
    if (!todo) return;

    todo.completed = event.target.checked;

    const todoWhen = todoItem.querySelector(".when_todo");
    const todoWhat = todoItem.querySelector(".what_todo");

    if (todo.completed) {
      todoWhen.style.color = "rgba(29, 27, 30, 0.50)";
      todoWhat.style.color = "rgba(29, 27, 30, 0.50)";
      todoWhat.style.textDecoration = "line-through";
    } else {
      todoWhen.style.color = "#1D1B1E";
      todoWhat.style.color = "#1D1B1E";
      todoWhat.style.textDecoration = "none";
    }

    localStorage.setItem("list", JSON.stringify(todoList));
  }
});

const allStatus = document.querySelector(".all");
const activeStatus = document.querySelector(".active");
const finishStatus = document.querySelector(".finished");

function initStatusButtons() {
  const allStatus = document.querySelector(".all");
  const activeStatus = document.querySelector(".active");
  const finishStatus = document.querySelector(".finished");

  allStatus.addEventListener("click", () => {
    allStatus.style.backgroundColor = "#E8DEF8";
    activeStatus.style.backgroundColor = "#F0F0F0";
    finishStatus.style.backgroundColor = "#F0F0F0";
    finishStatus.style.paddingLeft = "0px";

    renderTodos();
    checkEmptyListAndShowMessage();
  });

  activeStatus.addEventListener("click", () => {
    allStatus.style.backgroundColor = "#F0F0F0";
    activeStatus.style.backgroundColor = "#E8DEF8";
    finishStatus.style.backgroundColor = "#F0F0F0";
    finishStatus.style.paddingLeft = "0px";

    listTodo.innerHTML = "";
    const activeTodos = todoList.filter((todo) => !todo.completed);
    activeTodos.forEach((todo) => renderTodoItem(todo));

    checkEmptyListAndShowMessage();
  });

  finishStatus.addEventListener("click", () => {
    allStatus.style.backgroundColor = "#F0F0F0";
    activeStatus.style.backgroundColor = "#F0F0F0";
    finishStatus.style.backgroundColor = "#E8DEF8";

    listTodo.innerHTML = "";
    const finishedTodos = todoList.filter((todo) => todo.completed);
    finishedTodos.forEach((todo) => renderTodoItem(todo));

    checkEmptyListAndShowMessage();
  });

  const buttons = document.querySelectorAll(".button_styles");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
}

function checkEmptyListAndShowMessage() {
  const existing = listTodo.querySelector(".empty_message");

  const hasTodos = listTodo.querySelector(".list_style");

  if (!hasTodos && !existing) {
    const message = document.createElement("p");
    message.classList.add("empty_message");
    message.textContent = "Ваш список пока пуст";
    listTodo.appendChild(message);
  } else if (hasTodos && existing) {
    existing.remove();
  }
}

/*==============search==============*/

const searchInput = document.querySelector("#search_input");

function renderFilteredList(filteredSearch) {
  listTodo.innerHTML = "";
  if (filteredSearch.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Совпадений не найдено";
    emptyMessage.classList.add("empty_message");
    listTodo.appendChild(emptyMessage);
  } else {
    filteredSearch.forEach((todo) => renderTodoItem(todo));
  }
}

searchInput.addEventListener("input", () => {
  const input = searchInput.value.trim().toLowerCase();
  const filteredSearch = todoList.filter((item) =>
    item.title.toLowerCase().includes(input)
  );
  renderFilteredList(filteredSearch);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = searchInput.value.trim().toLowerCase();
    const filteredSearch = todoList.filter((item) =>
      item.title.toLowerCase().includes(input)
    );
    renderFilteredList(filteredSearch);
  }
});
