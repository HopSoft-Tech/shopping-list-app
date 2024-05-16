const itemForm = document.getElementById("item-form");
const itemInput = itemForm.querySelector("#item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  // Get all items from local storage
  const itemsFromStorage = getItemsFromStorage();
  // Loop through the items and add them to the DOM
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    itemInput.value = ""; // Clear the input field
    itemInput.focus(); // Set the focus back to the input field
    // newItem = "";
    return; // Stop the function from running
  }

  // check if editMode is true, then allow edit
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("This Item you are trying to add already exists!");
      return;
    }
  }

  // Create item DOM Element
  addItemToDom(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  // Call checkUI to Know if filter items and clearbtn should be added back to the DOM After the first item is added
  checkUI();
}

function addItemToDom(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li(item) to the DOM(ul tag)
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Add new item to the array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

// Code block to prevent the addition of Duplicate Items
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  // Selects all itemList & removes the edit mode on all, so it can be added to just one or the clicked item
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Do you really want to Delete?")) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.firstChild.textContent);
    checkUI(); //call the checkUI() again to check if there is no more list item.
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // filter out the item to be removed from the array
  itemsFromStorage = itemsFromStorage.filter(
    (itemFromStorage) => itemFromStorage !== item
  );

  // Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  // change the case of every character from the input element
  const text = e.target.value.toLowerCase();
  // console.log(text);
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function clearItems() {
  // Use this
  // itemList.innerHTML = '';
  // OR

  if (confirm("Do you really want to clear All?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // clear from localStorage using the default removeItem method
    // passing the keys to the method
    localStorage.removeItem("items");
  }

  checkUI(); //
}

function checkUI() {
  itemInput.value = "";

  // Gets all the li items
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false; // Makes sure the isEditMode is set back to false.
}

// Initialize App
function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  // clear Specific item
  itemList.addEventListener("click", onClickItem);
  // clear all Items
  clearBtn.addEventListener("click", clearItems);
  // filter items
  itemFilter.addEventListener("input", filterItems);

  document.addEventListener("DOMContentLoaded", displayItems);

  // Calls the checkUI, once the DOM is Loaded
  checkUI();
}

init();
