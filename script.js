// Class: set ToDoItem
class ToDoItem {
  constructor(body, id) {
    (this.body = body), (this.id = id);
  }
}

// Class: store ToDoItem in LocalStorage
class Store {
  static getItems() {
    let item;
    if (localStorage.getItem("todoList") === null) {
      item = [];
    } else {
      item = JSON.parse(localStorage.getItem("todoList"));
    }
    return item;
  }
  static addItem(todoItem) {
    const itemList = Store.getItems();
    itemList.push(todoItem);
    localStorage.setItem("todoList", JSON.stringify(itemList));
    //Store.getItems();
    //TodoList.showTodo();
  }
  static delItem(id) {
    const itemList = Store.getItems();
    itemList.forEach((item, i) => {
      if (item.id === Number(id)) {
        itemList.splice(i, 1);
      }
    });
    localStorage.setItem("todoList", JSON.stringify(itemList));
    Store.getItems();
    //TodoList.showTodo();
  }
}

// Class: show ToDoItem list
class TodoList {
  static showTodo() {
    const itemList = Store.getItems();
    itemList.forEach((item) => TodoList.addItem(item));
  }
  static addItem(item) {
    const raw = document.createElement("tr");
    raw.setAttribute("data-id", item.id);
    raw.innerHTML = `
      <td class="item" title="Click if You done it">${item.body}</td>
      <td><button class="delete" title="Delete this item">X</button></td>
    `;
    document.querySelector(".itemsBody").appendChild(raw);
  }
  static alert(msg, className) {
    const alertElement = document.createElement("h2");
    alertElement.className = `alert ${className}`;
    alertElement.innerText = msg;
    const section = document.querySelector("section"),
      table = document.querySelector("table");
    section.insertBefore(alertElement, table);
    setTimeout(() => {
      alertElement.remove();
    }, 3400);
  }
  static itemAction(target) {
    if (target.classList.contains("item")) {
      target.classList.toggle("checked");
    } else if (
      target.classList.contains("delete") &&
      target.tagName == "BUTTON"
    ) {
      Store.delItem(target.parentElement.parentElement.getAttribute("data-id"));
      target.parentElement.parentElement.remove();
      TodoList.alert("Todo deleted", "green");
    }
  }
}

//Event: Open popup window
document.querySelector(".add").addEventListener("click", () => {
  document.querySelector(".outer").classList.add("active");
});
// Event: Close Modal window
const closePopup = () => {
  document.querySelector(".outer").classList.remove("active");
};
document.querySelector(".inner").addEventListener("click", (e) => {
  e.stopPropagation();
});
let close = document.querySelectorAll(".close");
for (let i = 0; i < close.length; i++) {
  close[i].addEventListener("click", closePopup);
}

// Event: Add New Item from Modal and clear Input field
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newItemText = document.querySelector("input").value;
  if (newItemText !== "") {
    TodoList.alert("New todo created", "green");

    const idArr = new Uint16Array(1),
      uniqueId = window.crypto.getRandomValues(idArr);

    const newItem = new ToDoItem(newItemText, uniqueId[0]);
    TodoList.addItem(newItem);
    Store.addItem(newItem);
    document.querySelector("input").value = "";
  } else {
    TodoList.alert("Empty item is not valid! Please try again", "red");
  }
  closePopup();
  //console.log(newItemText);
});

// Event: Show ItemList onload
document.addEventListener("DOMContentLoaded", TodoList.showTodo);

// Event: Change style if Item done or remove it
document.querySelector(".itemsBody").addEventListener("click", (e) => {
  TodoList.itemAction(e.target);
});
