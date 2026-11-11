// Ka Lynti to-do list. Tasks are stored only in this browser's local storage.
(() => {
  const STORAGE_KEY = "ka-lynti-tasks-v1";
  const form = document.querySelector("#todo-form");
  if (!form) return;

  const input = document.querySelector("#todo-input");
  const list = document.querySelector("#todo-list");
  const empty = document.querySelector("#todo-empty");
  const count = document.querySelector("#task-count");
  const message = document.querySelector("#todo-message");
  const clearButton = document.querySelector("#clear-completed");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  let currentFilter = "all";
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];
      return stored.filter(task => task && typeof task.id === "string" && typeof task.text === "string" && typeof task.completed === "boolean");
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      message.textContent = "";
      return true;
    } catch {
      message.textContent = "Could not save your list. Check your browser storage settings.";
      return false;
    }
  }

  function visibleTasks() {
    if (currentFilter === "active") return tasks.filter(task => !task.completed);
    if (currentFilter === "completed") return tasks.filter(task => task.completed);
    return tasks;
  }

  function render() {
    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
    list.replaceChildren();

    for (const task of visibleTasks()) {
      const item = document.createElement("li");
      item.className = `todo-item${task.completed ? " is-complete" : ""}`;

      const label = document.createElement("label");
      label.className = "todo-task-label";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `${task.completed ? "Mark as not done" : "Mark as done"}: ${task.text}`);
      checkbox.addEventListener("change", () => {
        tasks = tasks.map(item => item.id === task.id ? { ...item, completed: checkbox.checked } : item);
        saveTasks();
        render();
      });

      const text = document.createElement("span");
      text.className = "todo-task-text";
      text.textContent = task.text;
      label.append(checkbox, text);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-task";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", `Delete task: ${task.text}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter(item => item.id !== task.id);
        saveTasks();
        render();
      });

      item.append(label, remove);
      list.append(item);
    }

    empty.hidden = visibleTasks().length > 0;
    clearButton.disabled = !tasks.some(task => task.completed);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, text, completed: false });
    saveTasks();
    input.value = "";
    render();
    input.focus();
  });

  filterButtons.forEach(button => button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle("is-selected", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    render();
  }));

  clearButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    render();
  });

  render();
})();
