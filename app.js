document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");
  const cartBtn = document.getElementById("cart-btn");
  const cartSection = document.getElementById("cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const clearCartBtn = document.getElementById("clear-cart");
  const overlay = document.getElementById("overlay");

  let cart = JSON.parse(localStorage.getItem("comfyCart")) || [];

  function saveCart() {
    localStorage.setItem("comfyCart", JSON.stringify(cart));
  }

  function openCart() {
    cartSection.classList.add("open");
    overlay.classList.add("active");
  }

  function closeCart() {
    cartSection.classList.remove("open");
    overlay.classList.remove("active");
  }

  cartBtn.addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);

  fetch("products.json")
    .then((res) => res.json())
    .then((data) => displayProducts(data.items));

  function displayProducts(products) {
    products.forEach((product) => {
      const { title, price, image } = product.fields;
      const id = product.sys.id;
      const imageUrl = image.fields.file.url;

      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <h3>${title}</h3>
        <p>$${price.toFixed(2)}</p>
        <button data-id="${id}" class="add-to-cart">Add to Cart</button>
      `;
      productsContainer.appendChild(div);
    });

    document.querySelectorAll(".add-to-cart").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const existing = cart.find((item) => item.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          const product = e.target.closest(".product");
          const title = product.querySelector("h3").textContent;
          const price = parseFloat(product.querySelector("p").textContent.slice(1));
          const image = product.querySelector("img").src;
          cart.push({ id, title, price, image, quantity: 1 });
        }
        updateCart();
        openCart();
      })
    );
  }

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      count += item.quantity;

      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" />
        <div style="flex: 1; margin-left: 10px;">
          ${item.title}<br>
          <small>$${item.price.toFixed(2)} × ${item.quantity}</small>
        </div>
        <button class="qty" data-index="${index}" data-action="dec">-</button>
        <button class="qty" data-index="${index}" data-action="inc">+</button>
        <button class="remove-item" data-index="${index}">x</button>
      `;
      cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = count;
    saveCart();

    document.querySelectorAll(".remove-item").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        cart.splice(e.target.dataset.index, 1);
        updateCart();
      })
    );

    document.querySelectorAll(".qty").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;
        if (action === "inc") cart[index].quantity++;
        else if (action === "dec") {
          cart[index].quantity--;
          if (cart[index].quantity <= 0) cart.splice(index, 1);
        }
        updateCart();
      })
    );
  }

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCart();
  });

  updateCart(); // initialize
});

// Load Testimonials
fetch("testimonials.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("testimonial-list");
    data.forEach(testimonial => {
      const div = document.createElement("div");
      div.className = "testimonial";
      div.innerHTML = `
        <p>"${testimonial.text}"</p>
        <h4>- ${testimonial.name}</h4>
      `;
      list.appendChild(div);
    });
  });

// Nav Toggle (Responsive)
document.getElementById("nav-toggle").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("show");
});

