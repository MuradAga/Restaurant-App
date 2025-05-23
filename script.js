const menu = [
  { id: 1, name: "Pizza", price: 12 },
  { id: 2, name: "Burger", price: 8 },
  { id: 3, name: "Salat", price: 6 }
];

const cart = [];

function renderMenu() {
  const menuDiv = document.getElementById("menuItems");
  menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.price} ₼</p>
      <input type="number" min="1" value="1" id="qty-${item.id}">
      <button onclick="addToCart(${item.id})">Əlavə et</button>
    `;
    menuDiv.appendChild(div);
  });
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const item = menu.find(m => m.id === id);
  cart.push({ ...item, quantity: qty });
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} = ${item.quantity * item.price} ₼`;
    list.appendChild(li);
    total += item.quantity * item.price;
  });
  document.getElementById("totalPrice").textContent = total + " ₼";
}

function confirmOrder() {
  alert("Sifariş təsdiqləndi!");
  // Burada API-yə POST göndərə bilərik
}

function callWaiter() {
  alert("Ofisianta xəbər verildi!");
}

function requestBill() {
  const method = confirm("Nağd ödəniş? OK = Nağd, İmtina = Kart");
  alert(`Ödəniş növü: ${method ? "Nağd" : "Kart"}`);
}

function clearCart() {
  cart.length = 0;
  updateCart();
}


renderMenu();
