const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ১. ডাটাবেজ (সাময়িক) - আপনার দেওয়া অল প্রোডাক্টস লিস্ট
let products = [
  {id:1, name:'Premium Wireless Headphones', price:2499, old:3999, emoji:'🎧', badge:'Hot', cat:'Electronics', rating:5},
  {id:2, name:'Smart Watch Pro', price:4999, old:7500, emoji:'⌚', badge:'Sale', cat:'Electronics', rating:5},
  {id:3, name:'Cotton Casual T-Shirt', price:599, old:899, emoji:'👕', badge:'', cat:'Fashion', rating:4},
  {id:4, name:'Running Shoes', price:1899, old:2500, emoji:'👟', badge:'New', cat:'Sports', rating:5},
  {id:5, name:'Coffee Maker Deluxe', price:3299, old:4500, emoji:'☕', badge:'', cat:'Home & Living', rating:4},
  {id:6, name:'Gaming Mechanical Keyboard', price:2199, old:3200, emoji:'⌨️', badge:'Hot', cat:'Gaming', rating:5},
  {id:7, name:'Skincare Face Serum', price:899, old:1200, emoji:'✨', badge:'New', cat:'Beauty', rating:4},
  {id:8, name:'Yoga Mat Premium', price:1299, old:1800, emoji:'🧘', badge:'', cat:'Sports', rating:4}
];
let orders = [];

// ======= ২. কাস্টমারদের জন্য মূল ওয়েবসাইট (আপনার ডিজাইন) =======
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shinrai — Your One-Stop Store</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #1a1a2e;
    --accent: #e94560;
    --accent2: #f5a623;
    --bg: #f8f7f4;
    --white: #ffffff;
    --gray: #6b7280;
    --light: #f1f0ed;
    --border: #e5e4e0;
    --success: #22c55e;
    --text: #1a1a2e;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  a { text-decoration: none; color: inherit; }

  /* NAV */
  nav {
    background: var(--primary);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px; position: sticky; top: 0; z-index: 100;
  }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: #fff; }
  .logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 1.5rem; align-items: center; }
  .nav-links a { color: rgba(255,255,255,0.8); font-size: 0.9rem; transition: color 0.2s; }
  .nav-links a:hover { color: #fff; }
  .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn-cart {
    background: var(--accent); color: #fff; border: none; padding: 0.5rem 1.25rem;
    border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.4rem; transition: opacity 0.2s;
  }
  .btn-cart:hover { opacity: 0.9; }
  .cart-count {
    background: var(--accent2); color: var(--primary); border-radius: 50%;
    width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700;
  }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
    padding: 5rem 2rem;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; text-align: center;
  }
  .hero-badge {
    background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.4);
    color: var(--accent); padding: 0.35rem 1rem; border-radius: 50px;
    font-size: 0.8rem; font-weight: 500; margin-bottom: 1.5rem; display: inline-block;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 1rem;
  }
  .hero h1 span { color: var(--accent); }
  .hero p { color: rgba(255,255,255,0.65); font-size: 1.1rem; max-width: 540px; margin-bottom: 2rem; }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .btn-primary {
    background: var(--accent); color: #fff; padding: 0.8rem 2rem;
    border-radius: 8px; font-weight: 500; border: none; cursor: pointer;
    font-size: 1rem; font-family: 'DM Sans', sans-serif; transition: transform 0.15s;
  }
  .btn-primary:hover { transform: translateY(-2px); }

  /* CATEGORIES */
  .section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
  .section-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;
  }
  .section-title { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 700; }
  .cats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; }
  .cat-card {
    background: var(--white); border: 1px solid var(--border); border-radius: 12px;
    padding: 1.5rem 1rem; text-align: center; cursor: pointer; transition: all 0.2s;
  }
  .cat-card:hover { border-color: var(--accent); transform: translateY(-3px); }
  .cat-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .cat-name { font-size: 0.85rem; font-weight: 500; }

  /* PRODUCTS */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
  .product-card {
    background: var(--white); border-radius: 12px; border: 1px solid var(--border);
    overflow: hidden; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between;
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
  .product-img {
    width: 100%; aspect-ratio: 1; background: var(--light);
    display: flex; align-items: center; justify-content: center; font-size: 3.5rem; position: relative;
  }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-badge {
    position: absolute; top: 10px; left: 10px;
    background: var(--accent); color: #fff; font-size: 0.7rem; font-weight: 600;
    padding: 0.2rem 0.5rem; border-radius: 4px; z-index: 2;
  }
  .product-info { padding: 1rem; }
  .product-name { font-weight: 500; font-size: 0.95rem; margin-bottom: 0.25rem; height: 40px; overflow: hidden; }
  .product-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
  .product-price { font-weight: 700; font-size: 1.05rem; color: var(--accent); }
  .product-old-price { text-decoration: line-through; color: var(--gray); font-size: 0.82rem; margin-left: 0.4rem; }
  .stars { color: var(--accent2); font-size: 0.8rem; }
  .btn-add {
    background: var(--primary); color: #fff; border: none; border-radius: 6px;
    padding: 0.5rem 1rem; font-size: 0.82rem; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.2s; width: 100%; margin-top: 0.75rem;
  }
  .btn-add:hover { background: var(--accent); }

  /* PROMO BANNER */
  .promo-banner {
    background: linear-gradient(120deg, #e94560, #f5a623);
    margin: 0 2rem; border-radius: 16px; padding: 3rem 3rem;
    display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .promo-text h2 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; }
  .promo-text p { color: rgba(255,255,255,0.85); margin-top: 0.4rem; }
  .promo-emoji { font-size: 5rem; }

  /* FOOTER */
  footer { background: var(--primary); color: rgba(255,255,255,0.7); padding: 3rem 2rem 1.5rem; margin-top: 4rem; }
  .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto 2rem; }
  .footer-col h4 { color: #fff; font-family: 'Syne', sans-serif; font-weight: 600; margin-bottom: 1rem; }
  .footer-col ul { list-style: none; }
  .footer-col ul li { margin-bottom: 0.5rem; font-size: 0.9rem; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; text-align: center; font-size: 0.85rem; max-width: 1200px; margin: 0 auto; }

  /* MODAL */
  .modal-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 1000; align-items: center; justify-content: center; padding: 1rem;
  }
  .modal-overlay.active { display: flex; }
  .modal { background: var(--white); border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto; }
  .modal-close { position: absolute; top: 1rem; right: 1rem; background: var(--light); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .modal h2 { font-family: 'Syne', sans-serif; font-size: 1.4rem; margin-bottom: 1.5rem; }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.4rem; color: var(--gray); }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.65rem 0.9rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; outline: none; background: var(--bg); }
  .payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.5rem; }
  .pay-option { border: 1.5px solid var(--border); border-radius: 8px; padding: 0.65rem; cursor: pointer; text-align: center; font-size: 0.85rem; }
  .pay-option.selected { border-color: var(--accent); background: rgba(233,69,96,0.05); }
  .cart-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
  .cart-item-img { font-size: 2rem; width: 50px; height: 50px; background: var(--light); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 0.9rem; font-weight: 500; }
  .cart-item-price { font-size: 0.85rem; color: var(--accent); font-weight: 600; }
  .cart-total { font-size: 1.1rem; font-weight: 700; text-align: right; margin-top: 1rem; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--primary); color: #fff; padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.9rem; opacity: 0; transition: opacity 0.3s; z-index: 9999; }
  .toast.show { opacity: 1; }
  .search-bar { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 0.45rem 1rem; color: #fff; font-size: 0.9rem; outline: none; width: 220px; }
</style>
</head>
<body>

<nav>
  <div class="logo">Shinrai<span>Nest</span></div>
  <div class="nav-links">
    <a href="#">Home</a>
    <a href="#products">Products</a>
    <a href="/admin" style="color: var(--accent2); font-weight: 600;">Admin Panel ↗</a>
  </div>
  <div class="nav-actions">
    <input type="text" class="search-bar" placeholder="Search products..." id="searchInput" oninput="filterProducts()">
    <button class="btn-cart" onclick="openCart()">🛒 Cart <span class="cart-count" id="cartCount">0</span></button>
  </div>
</nav>

<section class="hero">
  <div class="hero-badge">🔥 Mega Sale — Up to 60% Off</div>
  <h1>Everything You Need,<br><span>All in One Place</span></h1>
  <p>Shop thousands of products across all categories with fast delivery across Bangladesh.</p>
  <div class="hero-btns">
    <button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Shop Now</button>
  </div>
</section>

<div class="section">
  <div class="section-header"><h2 class="section-title">Browse Categories</h2></div>
  <div class="cats-grid" id="categoriesGrid"></div>
</div>

<div class="section" id="products">
  <div class="section-header">
    <h2 class="section-title">Featured Products</h2>
  </div>
  <div class="products-grid" id="productsGrid"></div>
</div>

<div style="max-width:1200px; margin: 0 auto; padding: 0 2rem 4rem;">
  <div class="promo-banner">
    <div class="promo-text">
      <h2>Free Delivery on Orders<br>Over ৳999!</h2>
      <p>Use code <strong>FREEDEL</strong> at checkout. Limited time offer.</p>
    </div>
    <div class="promo-emoji">🚀</div>
  </div>
</div>

<footer>
  <div class="footer-grid">
    <div class="footer-col">
      <h4>Shinrai</h4>
      <p style="font-size:0.88rem; line-height:1.6;">Bangladesh's favorite general store. Quality products, fast delivery.</p>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul><li>📞 01XXXXXXXXX</li><li>support@shinrai.bd</li><li>Dhaka, Bangladesh</li></ul>
    </div>
  </div>
  <div class="footer-bottom"><p>© 2026 Shinrai. All rights reserved.</p></div>
</footer>

<div class="modal-overlay" id="cartModal">
  <div class="modal">
    <button class="modal-close" onclick="closeCart()">✕</button>
    <h2>🛒 Your Cart</h2>
    <div id="cartItems"></div>
    <div class="cart-total" id="cartTotal"></div>
    <button class="btn-primary" style="width:100%;margin-top:1rem;" onclick="openCheckout()">Proceed to Checkout</button>
  </div>
</div>

<div class="modal-overlay" id="checkoutModal">
  <div class="modal">
    <button class="modal-close" onclick="closeCheckout()">✕</button>
    <h2>Checkout</h2>
    <form action="/place-order" method="POST" id="checkoutForm">
        <input type="hidden" name="cartData" id="hiddenCartData">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="customerName" placeholder="Your full name" required>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" name="customerPhone" placeholder="01XXXXXXXXX" required>
        </div>
        <div class="form-group">
          <label>Delivery Address</label>
          <textarea name="customerAddress" placeholder="Full address..." rows="2" required style="width: 100%; padding: 0.65rem 0.9rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg);"></textarea>
        </div>
        <div class="form-group">
          <label>Payment Method</label>
          <select name="paymentMethod" style="width:100%; padding:10px; border-radius:8px;">
             <option value="bKash">bKash</option>
             <option value="Nagad">Nagad</option>
             <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div id="checkoutTotal" style="font-size:1.1rem;font-weight:700;text-align:right;margin:1rem 0;color:var(--accent);"></div>
        <button type="button" class="btn-primary" style="width:100%;" onclick="submitOrderForm()">Place Order ✓</button>
    </form>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const categories = [
  {icon:'👗',name:'Fashion'}, {icon:'📱',name:'Electronics'}, {icon:'🏠',name:'Home & Living'},
  {icon:'💄',name:'Beauty'}, {icon:'🎮',name:'Gaming'}, {icon:'📚',name:'Books'},
  {icon:'🍕',name:'Food'}, {icon:'⚽',name:'Sports'}
];

// ব্যাকএন্ড ডাটাবেজ থেকে ডাটা রিড করা
const allProducts = ` + JSON.stringify(products) + `;

let cart = JSON.parse(localStorage.getItem('shopnest_cart') || '[]');

function renderCategories() {
  document.getElementById('categoriesGrid').innerHTML = categories.map(c =>
    \`<div class="cat-card" onclick="filterByCat('\${c.name}')">
      <div class="cat-icon">\${c.icon}</div>
      <div class="cat-name">\${c.name}</div>
    </div>\`
  ).join('');
}

function renderProducts(productsList) {
  document.getElementById('productsGrid').innerHTML = productsList.map(p => {
    let imageContent = (p.img && (p.img.startsWith('http://') || p.img.startsWith('https://'))) 
      ? \`<img src="\${p.img}" onerror="this.src='https://placehold.co/300x300?text=Product'">\` 
      : (p.emoji || '📦');
      
    return \`<div class="product-card">
      <div class="product-img">
        \${p.badge ? \`<span class="product-badge">\${p.badge}</span>\` : ''}
        \${imageContent}
      </div>
      <div class="product-info">
        <div class="product-name">\${p.name || p.title}</div>
        <div class="stars">★★★★★</div>
        <div class="product-meta">
          <div>
            <span class="product-price">৳\${p.price.toLocaleString()}</span>
            \${p.old ? \`<span class="product-old-price">৳\${p.old.toLocaleString()}</span>\` : ''}
          </div>
        </div>
        <button class="btn-add" onclick="addToCart(\${p.id})">Add to Cart</button>
      </div>
    </div>\`;
  }).join('');
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allProducts.filter(p => (p.name || p.title).toLowerCase().includes(q));
  renderProducts(filtered);
}

function filterByCat(cat) {
  const filtered = allProducts.filter(p => p.cat === cat);
  renderProducts(filtered.length ? filtered : allProducts);
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
}

function addToCart(id) {
  const p = allProducts.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({...p, qty: 1});
  localStorage.setItem('shopnest_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ Added to cart!');
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((s,i) => s+i.qty, 0);
}

function openCart() {
  const modal = document.getElementById('cartModal');
  modal.classList.add('active');
  const itemsEl = document.getElementById('cartItems');
  if (!cart.length) {
    itemsEl.innerHTML = '<p style="color:var(--gray);text-align:center;padding:2rem 0;">Your cart is empty</p>';
    document.getElementById('cartTotal').textContent = '';
    return;
  }
  itemsEl.innerHTML = cart.map(i => \`<div class="cart-item">
      <div class="cart-item-img">\${(i.img && i.img.startsWith('http')) ? \`<img src="\${i.img}">\` : (i.emoji || '📦')}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">\${i.name || i.title}</div>
        <div class="cart-item-price">৳\${i.price.toLocaleString()} × \${i.qty}</div>
      </div>
      <button onclick="removeFromCart(\${i.id})" style="background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--gray);">✕</button>
    </div>\`).join('');
  const total = cart.reduce((s,i) => s + i.price*i.qty, 0);
  document.getElementById('cartTotal').textContent = \`Total: ৳\${total.toLocaleString()}\`;
}

function closeCart() { document.getElementById('cartModal').classList.remove('active'); }

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('shopnest_cart', JSON.stringify(cart));
  updateCartCount(); openCart();
}

function openCheckout() {
  closeCart();
  const total = cart.reduce((s,i) => s + i.price*i.qty, 0);
  document.getElementById('checkoutTotal').textContent = \`Total: ৳\${total.toLocaleString()}\`;
  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() { document.getElementById('checkoutModal').classList.remove('active'); }

function submitOrderForm() {
    if(cart.length === 0) { alert('Cart is empty!'); return; }
    document.getElementById('hiddenCartData').value = JSON.stringify(cart);
    localStorage.removeItem('shopnest_cart');
    document.getElementById('checkoutForm').submit();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

renderCategories();
renderProducts(allProducts);
updateCartCount();
</script>
</body>
</html>
    `);
});

// ======= ৩. অর্ডার প্লেস করার ব্যাকএন্ড লজিক =======
app.post('/place-order', (req, res) => {
    const { cartData, customerName, customerPhone, customerAddress, paymentMethod } = req.body;
    let items = JSON.parse(cartData || '[]');
    
    let productTitles = items.map(i => (i.name || i.title) + " (" + i.qty + "টি)").join(', ');
    let totalPrice = items.reduce((s, i) => s + (i.price * i.qty), 0);

    orders.push({
        id: orders.length + 1,
        productTitle: productTitles,
        productPrice: totalPrice,
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        date: new Date().toLocaleString()
    });
    res.send('<h1>🎉 Order Successful! আপনার অর্ডারটি গ্রহণ করা হয়েছে।</h1><a href="/" style="padding:10px; background:#e94560; color:#white; text-decoration:none; border-radius:5px;">হোম পেজে ফিরে যান</a>');
});

// ======= ৪. আপনার নিজের জন্য প্রফেশনাল অ্যাডমিন ড্যাশবোর্ড =======
app.get('/admin', (req, res) => {
    let orderRows = '';
    for(let j=0; j<orders.length; j++) {
        let o = orders[j];
        orderRows += `
        <tr>
            <td>#` + o.id + `</td>
            <td>` + o.customerName + `</td>
            <td>` + o.customerPhone + `</td>
            <td>` + o.customerAddress + `</td>
            <td>` + o.productTitle + `</td>
            <td>৳` + o.productPrice + `</td>
            <td><strong>` + o.paymentMethod + `</strong></td>
            <td>` + o.date + `</td>
        </tr>`;
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Shinrai Admin Panel</title>
        <style>
            body { font-family:sans-serif; background:#f4f6f9; padding:30px; }
            .card { background:white; padding:20px; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); margin-bottom:20px; }
            table { width:100%; border-collapse: collapse; margin-top:15px; }
            th, td { padding:12px; border: 1px solid #ddd; text-align:left; }
            th { background:#1a1a2e; color:white; }
            .btn { background:#22c55e; color:white; padding:10px 15px; border:none; border-radius:4px; cursor:pointer; font-weight:bold; text-decoration:none; }
            .form-input { padding:8px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h2>📊 Shinrai Admin Dashboard (মালিকের প্যানেল)</h2>
        <br>
        <div class="card">
            <h3>➕ নতুন প্রোডাক্ট যোগ করুন (Add Product)</h3>
            <form action="/admin/add-product" method="POST" style="margin-top:10px;">
                <input type="text" name="title" class="form-input" placeholder="Product Name" style="width:220px;" required>
                <input type="number" name="price" class="form-input" placeholder="Price" style="width:100px;" required>
                <input type="text" name="imgUrl" class="form-input" placeholder="Image URL (ছবির লিঙ্ক)" style="width:250px;">
                <select name="category" class="form-input">
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Sports">Sports</option>
                    <option value="Beauty">Beauty</option>
                </select>
                <button type="submit" class="btn">Add Product</button>
            </form>
        </div>

        <div class="card">
            <h3>📦 কাস্টমারদের অর্ডার লিস্ট (Customer Orders)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Product & Qty</th>
                        <th>Total Price</th>
                        <th>Payment</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    ` + (orderRows || '<tr><td colspan="8" style="text-align:center;">এখনো কোনো অর্ডার আসেনি।</td></tr>') + `
                </tbody>
            </table>
        </div>
        <br>
        <a href="/" class="btn" style="background:#007bff;">🌐 ওয়েবসাইট দেখুন</a>
    </body>
    </html>
    `);
});

// ======= ৫. নতুন প্রোডাক্ট অ্যাড করার ব্যাকএন্ড লজিক =======
app.post('/admin/add-product', (req, res) => {
    const { title, price, imgUrl, category } = req.body;
    let finalImg = imgUrl ? imgUrl : "📦";

    products.push({
        id: products.length + 1,
        name: title,
        title: title,
        price: parseInt(price),
        img: finalImg,
        badge: 'New',
        cat: category,
        rating: 5
    });
    res.redirect('/admin');
});

app.listen(PORT, () => {
    console.log(`Shinrai server running on port ${PORT}`);
});
