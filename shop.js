(() => {
  const storageKey = "xiang-tie-order-v1";
  const buttons = [...document.querySelectorAll(".add-to-order")];
  const itemsNode = document.querySelector(".order-items");
  const emptyNode = document.querySelector(".order-empty");
  const totalsNode = document.querySelector(".order-totals");
  const subtotalNode = document.querySelector(".order-subtotal");
  const countNode = document.querySelector(".cart-count");
  const emailNode = document.querySelector(".order-email");
  const clearNode = document.querySelector(".clear-order");

  if (!itemsNode) return;

  let order = {};
  try {
    order = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
  } catch (_error) {
    order = {};
  }

  const money = (value) => `AU$${Number(value).toFixed(2)}`;

  const save = () => localStorage.setItem(storageKey, JSON.stringify(order));

  const orderLines = () => Object.values(order).filter((item) => item.quantity > 0);

  const updateEmailLink = (lines, subtotal) => {
    if (!lines.length) {
      emailNode.href = "#shop";
      emailNode.textContent = "Add a product to begin";
      emailNode.classList.add("disabled");
      return;
    }

    const itemText = lines
      .map(
        (item) =>
          `${item.quantity} × ${item.name} (${item.sku}) — ${money(
            item.price * item.quantity,
          )}`,
      )
      .join("\n");
    const body = [
      "Hello XIANG TIE,",
      "",
      "I would like to request confirmation for this direct website order:",
      "",
      itemText,
      "",
      `Displayed product subtotal: ${money(subtotal)}`,
      "",
      "My delivery postcode:",
      "My full name:",
      "My contact number:",
      "",
      "Please confirm stock, exact specifications, shipping, final total and an order reference before I pay through Stripe.",
    ].join("\n");

    emailNode.href = `mailto:tiexiang0@gmail.com?subject=${encodeURIComponent(
      "Direct website order request — XIANG TIE",
    )}&body=${encodeURIComponent(body)}`;
    emailNode.textContent = "Email order for confirmation";
    emailNode.classList.remove("disabled");
  };

  const render = () => {
    const lines = orderLines();
    const quantity = lines.reduce((total, item) => total + item.quantity, 0);
    const subtotal = lines.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    countNode.textContent = String(quantity);
    emptyNode.hidden = lines.length > 0;
    totalsNode.hidden = lines.length === 0;
    subtotalNode.textContent = money(subtotal);
    itemsNode.replaceChildren();

    lines.forEach((item) => {
      const row = document.createElement("div");
      row.className = "order-line";
      row.innerHTML = `
        <div><strong>${item.name}</strong><small>${item.sku} · ${money(item.price)} each</small></div>
        <div class="quantity-control" aria-label="Quantity for ${item.name}">
          <button type="button" data-action="minus" data-sku="${item.sku}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-sku="${item.sku}" aria-label="Increase quantity">+</button>
        </div>
        <strong class="line-total">${money(item.price * item.quantity)}</strong>`;
      itemsNode.append(row);
    });

    updateEmailLink(lines, subtotal);
    save();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const { sku, name, price } = button.dataset;
      if (!order[sku]) {
        order[sku] = { sku, name, price: Number(price), quantity: 0 };
      }
      order[sku].quantity += 1;
      render();
      button.textContent = "Added ✓";
      window.setTimeout(() => {
        button.textContent = "Add to order";
      }, 900);
    });
  });

  itemsNode.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = order[button.dataset.sku];
    if (!item) return;
    item.quantity += button.dataset.action === "plus" ? 1 : -1;
    if (item.quantity <= 0) delete order[button.dataset.sku];
    render();
  });

  clearNode.addEventListener("click", () => {
    order = {};
    render();
  });

  render();
})();
