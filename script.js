const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li(item) to the DOM(ul tag)
  itemList.appendChild(li);

  // call checkUI to Know if filter items and clearbtn should be added back to the DOM
  checkUI();

  itemInput.value = "";
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

function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Do you really want to Delete?")) {
      e.target.parentElement.parentElement.remove();
      checkUI(); //call the checkUI() again to check if there is no more list item.
    }
  }
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  // change the case of every character from the input element
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    
  });

  console.log(text);

}

function clearItems() {
  // Use this
  // itemList.innerHTML = '';
  // OR
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
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
}

// Event Listeners
itemForm.addEventListener("submit", addItem);
// clear Specific item
itemList.addEventListener("click", removeItem);
// clear all Items
clearBtn.addEventListener("click", clearItems);

itemFilter.addEventListener('input', filterItems);

// Calls the checkUI, once the DOM is Loaded
checkUI();
