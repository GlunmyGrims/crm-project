let clients = null;

export function loadClients() {
  try {
    return JSON.parse(localStorage.getItem("clients")) || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function getClients() {
  return loadClients();
}

export function addClient(client) {
  const list = loadClients();
  list.push(client);
  localStorage.setItem("clients", JSON.stringify(list));
}

export function deleteClient(id) {
  const list = loadClients().filter((c) => c.id !== id);
  localStorage.setItem("clients", JSON.stringify(list));
}

export function findClientById(id) {
  const client = loadClients().find((c) => c.id === id);
  return client;
}

export function saveClientsToStorage(updatedList) {
  localStorage.setItem("clients", JSON.stringify(updatedList));
}
