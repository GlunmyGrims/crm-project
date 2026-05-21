export function render(clients) {
  const tbody = document.getElementById("crm-body");

  let html = "";

  for (const client of clients) {
    html += `
      <tr class="crm__row">
        <td class="crm__td crm__td--id">${client.id}</td>
        <td class="crm__td">${client.name}</td>
        <td class="crm__td">${client.email}</td>
        <td class="crm__td">${client.phone}</td>
        <td class="crm__td">${client.date}</td>
        <td class="crm__td">
          <select data-id="${client.id}" class="crm__select-estado ${getStatusClass(client.status)}">
            <option value="new"         ${client.status === "new" ? "selected" : ""}>New</option>
            <option value="in progress" ${client.status === "in progress" ? "selected" : ""}>In progress</option>
            <option value="closed"      ${client.status === "closed" ? "selected" : ""}>Closed</option>
            <option value="cancelled"   ${client.status === "cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td class="crm__td">
          <div class="crm__actions">
            <button data-id="${client.id}" class="crm__btn crm__btn--ed">
              <i class="bi bi-pencil"></i>
            </button>
            <button data-id="${client.id}" class="crm__btn crm__btn--del">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}

function getStatusClass(status) {
  if (status === "new") return "crm__estado--nuevo";
  if (status === "in progress") return "crm__estado--progreso";
  if (status === "closed") return "crm__estado--cerrado";
  return "crm__estado--cancelado";
}
