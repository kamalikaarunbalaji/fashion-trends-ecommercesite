// localStorage.clear();
let totalAddClicks = 0;
let cart = {};
let wishlist = new Set();

const products = {
  1: { idno: 1, name: "Product 1", price: 100, image: "images/4.webp" },
  2: { idno: 2, name: "Product 2", price: 200, image: "images/a.webp" },
  3: { idno: 3, name: "Product 3", price: 300, image: "images/b.webp" },
  4: { idno: 4, name: "Product 4", price: 400, image: "images/c.webp" },
  5: { idno: 5, name: "Product 5", price: 500, image: "images/f.webp" },
  6: { idno: 6, name: "Product 6", price: 600, image: "images/e.webp" }
};

const paymentDetails = {
  cart: cart,
  totalAmount: Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0)
};


function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify([...wishlist]));
  localStorage.setItem("totalAddClicks", totalAddClicks);
  localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
}

function loadFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  const storedWishlist = localStorage.getItem("wishlist");
  const storedClicks = localStorage.getItem("totalAddClicks");

  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  if (storedWishlist) {
    wishlist = new Set(JSON.parse(storedWishlist));
  }
  if (storedClicks) {
    totalAddClicks = parseInt(storedClicks);
  }
  updatebadge();
}

function addToCart(idno) {
  if (!cart[idno]) {
    cart[idno] = { ...products[idno], qty: 1 };
  } else {
    cart[idno].qty++;
  }
  totalAddClicks++;
  saveToLocalStorage();
  updatebadge();
}

function changeQty(idno, delta) {
  if (cart[idno]) {
    cart[idno].qty += delta;
    if (cart[idno].qty <= 0) delete cart[idno];
    saveToLocalStorage();
    updatebadge();
  }
}
// debugger;
function toggleWishlist(idno) {
  // debugger;
  const iconContainer = document.querySelector(`.product-card[idno="${idno}"] .wishlist-icon`);
  const icon = iconContainer.querySelector("i");

  if (wishlist.has(idno)) {
    wishlist.delete(idno);
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  } else {
    wishlist.add(idno);
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  document.getElementById("wishlist-badge").innerText = wishlist.size;
  saveToLocalStorage();
  updatebadge();
}

function updatebadge() {
  debugger;
  document.getElementById("cart-badge").innerText = totalAddClicks || 0;


  document.getElementById("wishlist-badge").innerText = wishlist.size || 0;

  const summary = document.getElementById("cart-summary");

  const itemsBox = document.getElementById("summary-items");
  itemsBox.innerHTML = '';

  let totalAmount = 0;
  Object.values(cart).forEach(item => {
    totalAmount += item.qty * item.price;
    itemsBox.innerHTML += `
    <div class="cart-item">
      <i class="fa-solid fa-xmark"
     onclick="removeitem(${item.idno})"></i>
     
          <img src="${item.image}" width="50%" height="100%">
          <p><strong>${item.name}</strong></p>
          <p>₹${item.price}</p>
            <button class="btn btn-outline-secondary fw-bold" style="width: 40px; height: 40px;" onclick="changeQty(${item.idno}, -1)">−</button>
            <span class="mx-3 fw-bold fs-5">${item.qty}</span>
            <button class="btn btn-outline-secondary fw-bold fs-5" style="width: 40px; height: 40px;" onclick="changeQty(${item.idno}, 1)">+</button> <hr>
     </div>`;
  });

  document.getElementById("total-amount").innerText = totalAmount;
  summary.style.display = Object.keys(cart).length ? 'block' : 'none';
}

window.removeitem = function (idno) {
  if (cart[idno]) {
    totalAddClicks -= cart[idno].qty;
    delete cart[idno];
    saveToLocalStorage();
    updatebadge();
  }
}

function payNow() {
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty.");
    return;
  }
  alert("Payment successful! Thank you.");

  let paidItems = JSON.parse(localStorage.getItem("paidProducts") || "[]");
  paidItems = paidItems.concat(Object.values(cart));
  localStorage.setItem("paidProducts", JSON.stringify(paidItems));

  cart = {};
  totalAddClicks = 0;
  saveToLocalStorage();
  updatebadge();
  renderCartTable();
  renderPaidProducts();
  if (document.getElementById("cart-products")) {
    document.getElementById("cart-products").innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
  }

  const totalAmt = document.getElementById("total-amount");
  if (totalAmt) totalAmt.innerText = "0";

  const summary = document.getElementById("cart-summary");
  if (summary) summary.style.display = "none";

}

function closeCartSummary() {
  const cartSummary = document.getElementById("cart-summary");
  if (cartSummary) {
    cartSummary.style.display = "none";
  }
}

window.onload = function () {
  loadFromLocalStorage();
  updatebadge();
  document.getElementById("carticon").addEventListener("click", () => {
    window.location.href = "cart.html";
  });
  document.getElementById("wishlisticon").addEventListener("click", () => {
    window.location.href = "wishlist.html";
  });
};


