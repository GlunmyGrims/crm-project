import {
  getClients,
  addClient,
  deleteClient,
  findClientById,
  loadClients,
  saveClientsToStorage,
} from "./logic.js";
import { render } from "./ui.js";

/* Variables */
const form = document.getElementById("crm__form__fields");

let id = getClients().reduce((max, c) => Math.max(max, c.id), 0);

const inputName = document.getElementById("inp-name");
const inputEmail = document.getElementById("inp-email");
const inputPhone = document.getElementById("inp-phone");

let inputs = [inputName, inputEmail, inputPhone];

const errorName = document.getElementById("span-error-name");
const errorEmail = document.getElementById("span-error-email");
const errorPhone = document.getElementById("span-error-phone");

const addButton = document.getElementById("btn-add");

let clientBeingEdited;

/* Delete */

const tbody = document.getElementById("crm-body");
tbody.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".crm__btn--del");

  if (!deleteBtn) return;

  const targetId = Number(deleteBtn.dataset.id);
  deleteClient(targetId);
  render(getClients());
});

/* Edit */

tbody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".crm__btn--ed");

  if (!editBtn) return;

  const targetId = Number(editBtn.dataset.id);
  clientBeingEdited = findClientById(targetId);
  populateFields(clientBeingEdited);
  setEditMode(clientBeingEdited);
});

/* Dropdown */

tbody.addEventListener("change", (e) => {
  const dropdown = e.target.closest(".crm__select-estado");

  if (!dropdown) return;

  const targetId = Number(dropdown.dataset.id);
  updateStatus(targetId, dropdown.value);
});

function updateStatus(clientId, status) {
  let clients = getClients();

  let target = clients.find((c) => c.id === clientId);

  if (!target) return;

  target.status = status;
  saveClientsToStorage(clients);
  render(clients);
}

function setEditMode(client) {
  if (client) {
    addButton.textContent = "↻ Update";
  }
}

function setAddMode() {
  addButton.textContent = "+ Add client";
}

/* Functions */

enableRealtimeValidation(inputs);

function createClient() {
  let client = {};

  // Build client object
  const now = new Date();
  id++;

  client.id = id;
  client.name = inputName.value;
  client.email = inputEmail.value;
  client.phone = inputPhone.value;
  client.date = now.toLocaleDateString();
  client.status = "new";

  addClient(client);
  render(getClients());
  clearInputs();
}

function clearInputs() {
  inputName.value = "";
  inputEmail.value = "";
  inputPhone.value = "";
}

function validateForm(inputs) {
  let isValid = true;

  for (const input of inputs) {
    let fieldValid = true;

    fieldValid =
      input.value.trim() !== "" &&
      (input !== inputName || validateName(input.value)) &&
      (input !== inputEmail || validateEmail(input.value)) &&
      (input !== inputPhone || validatePhone(input.value));

    const errorUpdaters = new Map([
      [inputName, setNameError],
      [inputEmail, setEmailError],
      [inputPhone, setPhoneError],
    ]);

    errorUpdaters.get(input)?.(fieldValid);

    if (fieldValid === false) {
      input.classList.add("crm__input--error");
      isValid = false;
    } else {
      input.classList.remove("crm__input--error");
    }
  }
  return isValid;
}

function enableRealtimeValidation(inputs) {
  for (const input of inputs) {
    input.addEventListener("input", () => {
      validateForm(inputs);
    });
  }
}

function validateName(name) {
  return /^[\p{L}\s]+$/u.test(name.trim());
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

function validatePhone(phone) {
  let digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function setNameError(isValid) {
  errorName.textContent = isValid
    ? ""
    : "Name cannot be empty and must not contain numbers or special characters.";
}

function setEmailError(isValid) {
  errorEmail.textContent = isValid
    ? ""
    : "Enter a valid email address (e.g. name@domain.com).";
}

function setPhoneError(isValid) {
  errorPhone.textContent = isValid
    ? ""
    : "Phone number must be between 10 and 15 digits, no letters or symbols.";
}

function populateFields(client) {
  if (!client) return;
  inputName.value = client.name;
  inputEmail.value = client.email;
  inputPhone.value = client.phone;
}

function saveClientChanges(edited) {
  let clients = getClients();

  let target = clients.find((c) => c.id === edited.id);

  if (!target) return;

  target.name = inputName.value;
  target.email = inputEmail.value;
  target.phone = inputPhone.value;

  saveClientsToStorage(clients);
  render(clients);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm(inputs)) return;

  if (clientBeingEdited) {
    saveClientChanges(clientBeingEdited);
    clearInputs();
    setAddMode();
    clientBeingEdited = undefined;
  } else {
    createClient();
  }
});

render(getClients());
