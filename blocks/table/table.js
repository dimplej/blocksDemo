function createTableHeader(table) {
  const tr = document.createElement("tr");
  const headers = ["firstName", "lastName", "email", "city"];

  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    tr.appendChild(th);
  });

  table.appendChild(tr);
}

function createTableRow(table, row) {
  const tr = document.createElement("tr");
  const cells = [
    { label: "firstName", value: row.firstName },
    { label: "lastName", value: row.lastName },
    { label: "email", value: row.email },
    { label: "city", value: row.city }
  ];

  cells.forEach(cell => {
    const td = document.createElement("td");
    td.textContent = cell.value;
    td.setAttribute("data-label", cell.label);
    tr.appendChild(td);
  });

  table.appendChild(tr);
}

function renderPaginationControls(container, currentPage, totalPages, onPageChange) {
  const nav = document.createElement("div");
  nav.className = "pagination";

  const prev = document.createElement("button");
  prev.textContent = "Previous";
  prev.disabled = currentPage === 1;
  prev.onclick = () => onPageChange(currentPage - 1);

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage === totalPages;
  next.onclick = () => onPageChange(currentPage + 1);

  const info = document.createElement("span");
  info.textContent = `Page ${currentPage} of ${totalPages}`;

  nav.appendChild(prev);
  nav.appendChild(info);
  nav.appendChild(next);

  container.appendChild(nav);
}

async function createPaginatedTable(jsonURL, container, page = 1, perPage = 5) {
  container.innerHTML = ""; // clear previous content

  try {
    const response = await fetch(jsonURL);
    const json = await response.json();
    const data = Array.isArray(json) ? json : json.data;

    const totalPages = Math.ceil(data.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageItems = data.slice(start, end);

    const table = document.createElement("table");
    createTableHeader(table);
    pageItems.forEach(row => createTableRow(table, row));

    container.appendChild(table);

    renderPaginationControls(container, page, totalPages, (newPage) => {
      createPaginatedTable(jsonURL, container, newPage, perPage);
    });
  } catch (error) {
    console.error("Failed to fetch or render table:", error);
  }
}

export default async function decorate(block) {
  const link = block.querySelector('a[href$=".json"]');
  const container = document.createElement("div");
  container.classList.add("sampleData");

  if (link) {
    await createPaginatedTable(link.href, container);
    link.replaceWith(container);
  }
}
