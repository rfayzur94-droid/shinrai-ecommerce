const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage system for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/'); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// ডাইনামিক ডাটাবেজ স্টেট
let products = [
  {id:1, name:'Premium Wireless Headphones', price:2499, old:3999, image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', badge:'Hot', cat:'Electronics', stock:45, status:'Active'},
  {id:2, name:'Smart Watch Pro', price:4999, old:7500, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', badge:'Sale', cat:'Electronics', stock:23, status:'Active'},
  {id:3, name:'Cotton Casual T-Shirt', price:599, old:899, image:'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', badge:'', cat:'Fashion', stock:120, status:'Active'}
];

let orders = [
  {id:'#ORD-1001', customer:'Rahim Uddin', phone:'01711234567', address:'Mirpur, Dhaka', items:2, total:4998, payment:'bKash', date:'2026-05-20', status:'Delivered'},
  {id:'#ORD-1002', customer:'Karim Shekh', phone:'01911223344', address:'Gulshan, Dhaka', items:1, total:2499, payment:'Nagad', date:'2026-05-25', status:'Pending'}
];

// ======= ১. কাস্টমারদের জন্য ফ্রন্টএন্ড ওয়েবসাইট =======
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ShopNest — Your One-Stop Store</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root { --primary: #1a1a2e; --accent: #e94560; --accent2: #f5a623; --bg: #f8f7f4; --white: #ffffff; --border: #e5e4e0; --text: #1a1a2e; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  nav { background: var(--primary); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: #fff; text-decoration:none; }
  .logo span { color: var(--accent); }
  .nav-links a { color: rgba(255,255,255,0.8); font-size: 0.9rem; text-decoration: none; margin-right: 15px; }
  .btn-cart { background: var(--accent); color: #fff; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; }
  .cart-count { background: var(--accent2); color: var(--primary); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
  .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); padding: 5rem 2rem; text-align: center; }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: 3rem; color: #fff; margin-bottom: 1rem; }
  .hero h1 span { color: var(--accent); }
  .hero p { color: rgba(255,255,255,0.65); }
  .section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
  .product-card { background: var(--white); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: 0.2s; }
  .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
  .product-img { width: 100%; aspect-ratio: 1; background: #f9fafb; display: flex; align-items: center; justify-content: center; }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-info { padding: 1rem; }
  .product-name { font-weight: 500; font-size: 0.95rem; margin-bottom: 0.25rem; }
  .product-price { font-weight: 700; font-size: 1.05rem; color: var(--accent); }
  .btn-add { background: var(--primary); color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; width: 100%; margin-top: 0.75rem; }
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; align-items: center; justify-content: center; padding: 1rem; }
  .modal-overlay.active { display: flex; }
  .modal { background: var(--white); border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; position: relative; }
  .modal-close { position: absolute; top: 1rem; right: 1rem; border: none; background: transparent; cursor: pointer; font-size: 1.2rem; }
  .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: .4rem;}
  .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.65rem; border: 1px solid var(--border); border-radius: 8px; }
  .btn-primary { background: var(--accent); color:#fff; padding:10px; border:none; border-radius:8px; width:100%; cursor:pointer; font-weight:bold; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--primary); color: #fff; padding: 0.75rem 1.25rem; border-radius: 8px; opacity: 0; transition: opacity 0.3s; z-index: 2000; }
  .toast.show { opacity: 1; }
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">Shop<span>Nest</span></a>
  <div class="nav-links"><a href="#">Home</a><a href="/admin" style="color: var(--accent2); font-weight: 600;">Admin Panel ↗</a></div>
  <div><button class="btn-cart" onclick="openCart()">🛒 Cart <span class="cart-count" id="cartCount">0</span></button></div>
</nav>

<section class="hero">
  <h1>Everything You Need,<br><span>All in One Place</span></h1>
  <p>Shop thousands of products across all categories with fast delivery.</p>
</section>

<div class="section">
  <h2 style="font-family:'Syne'; margin-bottom:2rem;">Featured Products</h2>
  <div class="products-grid" id="productsGrid"></div>
</div>

<div class="modal-overlay" id="detailModal">
  <div class="modal" style="max-width: 550px; display: flex; gap: 20px; align-items: center;">
    <button class="modal-close" onclick="closeModal('detailModal')">✕</button>
    <img id="detailImg" src="" style="width: 45%; aspect-ratio: 1; object-fit: cover; border-radius: 10px;">
    <div style="width: 55%;">
      <span id="detailCat" style="font-size: 0.8rem; color: var(--gray); text-transform: uppercase;"></span>
      <h2 id="detailName" style="font-family:'Syne'; margin: 5px 0 10px 0;"></h2>
      <h3 id="detailPrice" style="color: var(--accent); margin-bottom: 10px;"></h3>
      <p id="detailStock" style="font-size: 0.9rem; margin-bottom: 15px; font-weight:500;"></p>
      <button class="btn-primary" id="detailAddBtn">Add To Cart</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="cartModal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('cartModal')">✕</button>
    <h2>🛒 Your Cart</h2><br>
    <div id="cartItems"></div>
    <div id="cartTotal" style="font-weight:bold; text-align:right; margin: 10px 0;"></div>
    <button class="btn-primary" onclick="openCheckout()">Proceed to Checkout</button>
  </div>
</div>

<div class="modal-overlay" id="checkoutModal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('checkoutModal')">✕</button>
    <h2>Checkout</h2><br>
    <form action="/place-order" method="POST">
        <input type="hidden" name="cartData" id="hiddenCartData">
        <div class="form-group"><label>Name</label><input type="text" name="customerName" required></div>
        <div class="form-group"><label>Phone</label><input type="tel" name="customerPhone" required></div>
        <div class="form-group"><label>Address</label><textarea name="customerAddress" required></textarea></div>
        <div class="form-group"><label>Payment</label>
          <select name="paymentMethod"><option value="bKash">bKash</option><option value="Nagad">Nagad</option><option value="Cash on Delivery">Cash on Delivery</option></select>
        </div>
        <button type="submit" class="btn-primary" onclick="document.getElementById('hiddenCartData').value = JSON.stringify(cart);">Place Order ✓</button>
    </form>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const allProducts = ` + JSON.stringify(products) + `;
let cart = [];

function renderProducts() {
  document.getElementById('productsGrid').innerHTML = allProducts.map(p => \`
    <div class="product-card" onclick="viewProduct(\${p.id})">
      <div class="product-img"><img src="\${p.image}"></div>
      <div class="product-info">
        <div class="product-name">\${p.name}</div>
        <div class="product-price">৳\${p.price}</div>
        <button class="btn-add" onclick="event.stopPropagation(); addToCart(\${p.id})">Add to Cart</button>
      </div>
    </div>\`).join('');
}

function viewProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if(!p) return;
  document.getElementById('detailImg').src = p.image;
  document.getElementById('detailCat').textContent = p.cat;
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailPrice').textContent = '৳' + p.price;
  document.getElementById('detailStock').innerHTML = p.stock > 0 ? \`<span style="color:green;">In Stock (\${p.stock} left)</span>\` : \`<span style="color:red;">Out of Stock</span>\`;
  document.getElementById('detailAddBtn').onclick = () => { closeModal('detailModal'); addToCart(p.id); };
  document.getElementById('detailModal').classList.add('active');
}

function addToCart(id) {
  const p = allProducts.find(x => x.id === id);
  const exist = cart.find(x => x.id === id);
  if(exist) exist.qty++; else cart.push({...p, qty:1});
  document.getElementById('cartCount').textContent = cart.reduce((s,i)=>s+i.qty, 0);
  showToast('Added to cart!');
}
function openCart() {
  document.getElementById('cartModal').classList.add('active');
  document.getElementById('cartItems').innerHTML = cart.map(i=>\`<div style="margin-bottom:8px;">\${i.name} - ৳\${i.price} x \${i.qty}</div>\`).join('');
  document.getElementById('cartTotal').textContent = 'Total: ৳' + cart.reduce((s,i)=>s+(i.price*i.qty), 0);
}
function openCheckout() { closeModal('cartModal'); document.getElementById('checkoutModal').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function showToast(m) { const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000); }
renderProducts();
</script>
</body>
</html>
    `);
});

app.post('/place-order', (req, res) => {
    const { cartData, customerName, customerPhone, customerAddress, paymentMethod } = req.body;
    let items = JSON.parse(cartData || '[]');
    let totalItems = items.reduce((s, i) => s + i.qty, 0);
    let totalPrice = items.reduce((s, i) => s + (i.price * i.qty), 0);

    orders.unshift({
        id: '#ORD-' + (1000 + orders.length + 1),
        customer: customerName,
        phone: customerPhone,
        address: customerAddress,
        items: totalItems,
        total: totalPrice,
        payment: paymentMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });
    res.send('<h1>Order Placed Successfully!</h1><a href="/">Back to Shop</a>');
});

// ======= ২. আপনার শেয়ার করা প্রিমিয়াম ড্যাশবোর্ড (লজিক সহ সম্পূর্ণ সচল) =======
app.get('/admin', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ShopNest — Admin Panel</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #1a1a2e; --accent: #e94560; --accent2: #f5a623; --bg: #f3f4f6; --white: #ffffff; --gray: #6b7280; --light: #f9fafb; --border: #e5e7eb; --success: #10b981; --warning: #f59e0b; --danger: #ef4444; --info: #3b82f6; --text: #111827; --sidebar-w: 240px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }
  
  /* SIDEBAR */
  .sidebar { width: var(--sidebar-w); background: var(--primary); min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 50; display: flex; flex-direction: column; }
  .sidebar-logo { padding: 1.5rem; font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .sidebar-logo span { color: var(--accent); }
  .sidebar-logo small { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.72rem; color: rgba(255,255,255,0.4); }
  .sidebar-nav { padding: 1rem 0; flex: 1; }
  .nav-section-label { padding: 0.75rem 1.25rem 0.35rem; font-size: 0.68rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.05em; }
  .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 1.25rem; cursor: pointer; color: rgba(255,255,255,0.65); font-size: 0.9rem; font-weight: 400; transition: all 0.2s; }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
  .nav-item.active { background: rgba(233,69,96,0.12); color: var(--accent); border-left: 3px solid var(--accent); font-weight: 500; }
  
  /* MAIN CONTENT */
  .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; }
  .topbar { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; }
  .topbar-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); }
  .content { padding: 2rem; flex: 1; }
  .page { display: none; }
  .page.active { display: block; }
  
  /* STATS CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
  .stat-card { background: var(--white); border-radius: 12px; padding: 1.25rem 1.5rem; border: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; }
  .stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
  
  /* TABLES & CARDS */
  .card { background: var(--white); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  .card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--light); padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem; font-weight: 600; color: var(--gray); text-transform: uppercase; letter-spacing: 0.03em; }
  td { padding: 0.95rem 1rem; font-size: 0.88rem; color: var(--text); border-top: 1px solid var(--border); vertical-align: middle; }
  
  /* BADGES & BUTTONS */
  .badge { padding: 0.25rem 0.65rem; border-radius: 50px; font-size: 0.73rem; font-weight: 600; display: inline-block; }
  .badge-success { background: #d1fae5; color: #065f46; }
  .badge-warning { background: #fef3c7; color: #92400e; }
  .btn { padding: 0.5rem 1.1rem; border-radius: 7px; font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #d63e56; }
  .btn-danger { background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; }
  .btn-danger:hover { background: #ef4444; color: #fff; }
  
  /* STOCK UPDATER */
  .stock-btn { background: #e5e7eb; font-weight: bold; padding: 2px 8px; border-radius: 4px; border: none; cursor: pointer; margin: 0 4px; }
  .stock-btn:hover { background: #d1d5db; }
  
  /* MODAL POPUPS */
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; align-items: center; justify-content: center; padding: 1rem; }
  .modal-overlay.active { display: flex; }
  .modal { background: var(--white); border-radius: 14px; padding: 1.75rem; max-width: 520px; width: 100%; position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .form-group.full { grid-column: 1/-1; }
  .form-group input, .form-group select { padding: 0.65rem; border: 1px solid var(--border); border-radius: 7px; font-size: 0.88rem; }
  
  .table-img { width: 42px; height: 42px; border-radius: 6px; object-fit: cover; cursor: pointer; border: 1px solid var(--border); }
  .clickable-title { cursor: pointer; font-weight: 600; color: #1a1a2e; }
  .clickable-title:hover { color: var(--accent); text-decoration: underline; }
  .two-col { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.5rem; }
</style>
</head>
<body>

<aside class="sidebar">
  <div class="sidebar-logo">Shop<span>Nest</span><small>Admin Dashboard</small></div>
  <nav class="sidebar-nav">
    <div class="nav-section-label">Main Navigation</div>
    <div class="nav-item active" onclick="showPage('dashboard', this)">📊 Dashboard</div>
    <div class="nav-item" onclick="showPage('products', this)">📦 Products</div>
    <div class="nav-item" onclick="showPage('orders', this)">🛒 Orders</div>
    
    <div class="nav-section-label">Management</div>
    <div class="nav-item" style="opacity: 0.5; cursor: not-allowed;">🎟️ Coupons</div>
    <div class="nav-item" style="opacity: 0.5; cursor: not-allowed;">📁 Categories</div>
    <div class="nav-item" style="opacity: 0.5; cursor: not-allowed;">⚙️ Settings</div>
  </nav>
</aside>

<main class="main">
  <header class="topbar">
    <span class="topbar-title" id="topbarTitle">Dashboard</span>
    <div><a href="/" class="btn" style="background:var(--light); color:var(--text);">← View Store</a></div>
  </header>

  <div class="content">
    <div class="page active" id="page-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#d1fae5;">💰</div>
          <div><div style="font-size:0.78rem;color:var(--gray);">Total Revenue</div><div style="font-size:1.5rem;font-weight:bold;" id="statRevenue">৳0</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#e0f2fe;">🛒</div>
          <div><div style="font-size:0.78rem;color:var(--gray);">Total Orders</div><div style="font-size:1.5rem;font-weight:bold;" id="statOrders">0</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fef3c7;">📦</div>
          <div><div style="font-size:0.78rem;color:var(--gray);">Active Products</div><div style="font-size:1.5rem;font-weight:bold;" id="statProducts">0</div></div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header"><h3>Recent Live Orders</h3></div>
        <table>
          <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody id="recentOrders"></tbody>
        </table>
      </div>
    </div>

    <div class="page" id="page-products">
      <div style="margin-bottom:20px; text-align:right;">
        <button class="btn btn-primary" onclick="openModal('productModal')">+ Add New Product</button>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>Image</th><th>Product Name</th><th>Category</th><th>Price</th><th>Stock Control</th><th>Actions</th></tr></thead>
          <tbody id="adminProductsTable"></tbody>
        </table>
      </div>
    </div>

    <div class="page" id="page-orders">
      <div class="card">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody id="ordersTable"></tbody>
        </table>
      </div>
    </div>
  </div>
</main>

<div class="modal-overlay" id="adminViewModal">
  <div class="modal" style="max-width:440px; text-align:center;">
    <button style="position:absolute; top:12px; right:15px; background:none; border:none; font-size:1.3rem; cursor:pointer;" onclick="closeModal('adminViewModal')">✕</button>
    <img id="adminViewImg" src="" style="width:100%; max-height:260px; object-fit:cover; border-radius:8px; margin-bottom:15px;">
    <h3 id="adminViewName" style="font-family:'Syne'; margin-bottom:6px;"></h3>
    <p id="adminViewCat" style="color:var(--gray); font-size:0.8rem; text-transform:uppercase; font-weight:600; margin-bottom:12px;"></p>
    <h4 id="adminViewPrice" style="color:var(--accent); font-size:1.4rem; margin-bottom:12px;"></h4>
    <p id="adminViewStock" style="font-weight:bold; background:var(--light); padding:8px; border-radius:6px; display:inline-block;"></p>
  </div>
</div>

<div class="modal-overlay" id="productModal">
  <div class="modal">
    <button style="position:absolute; top:12px; right:15px; background:none; border:none; font-size:1.3rem; cursor:pointer;" onclick="closeModal('productModal')">✕</button>
    <h3 style="font-family:'Syne';">Create New Product</h3><br>
    <form action="/admin/add-product" method="POST" enctype="multipart/form-data">
      <div class="form-grid">
        <div class="form-group full"><label>Product Title</label><input type="text" name="name" required></div>
        <div class="form-group"><label>Price (৳)</label><input type="number" name="price" required></div>
        <div class="form-group"><label>Category</label>
          <select name="cat"><option>Electronics</option><option>Fashion</option><option>Sports</option><option>Home & Living</option></select>
        </div>
        <div class="form-group full"><label>Upload Banner/Image</label><input type="file" name="product_image" accept="image/*" required></div>
      </div><br>
      <button type="submit" class="btn btn-primary" style="width:100%;">Save & Publish ✓</button>
    </form>
  </div>
</div>

<script>
let products = ` + JSON.stringify(products) + `;
const orders = ` + JSON.stringify(orders) + `;

function loadDashboard() {
  const totalRev = orders.reduce((s,o) => s+o.total, 0);
  document.getElementById('statRevenue').textContent = '৳' + totalRev.toLocaleString();
  document.getElementById('statOrders').textContent = orders.length;
  document.getElementById('statProducts').textContent = products.length;

  document.getElementById('recentOrders').innerHTML = orders.slice(0,5).map(o => \`
    <tr><td>\${o.id}</td><td>\${o.customer}</td><td>৳\${o.total}</td><td><span class="badge badge-warning">\...\${o.status}</span></td></tr>\`).join('');
}

function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('topbarTitle').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  
  if(name==='dashboard') loadDashboard();
  if(name==='products') renderAdminProducts();
  if(name==='orders') {
    document.getElementById('ordersTable').innerHTML = orders.map(o => \`
      <tr><td>\${o.id}</td><td>\${o.customer}</td><td>\${o.items}</td><td>৳\${o.total}</td><td>\${o.payment}</td><td><span class="badge badge-success">\${o.status}</span></td></tr>\`).join('');
  }
}

function renderAdminProducts() {
  document.getElementById('adminProductsTable').innerHTML = products.map(p => \`
    <tr>
      <td><img src="\${p.image}" class="table-img" onclick="previewProduct(\${p.id})"></td>
      <td><span class="clickable-title" onclick="previewProduct(\${p.id})">\${p.name}</span></td>
      <td>\${p.cat}</td>
      <td>৳\${p.price}</td>
      <td>
        <button class="stock-btn" onclick="updateStock(\${p.id}, -1)">-</button>
        <span style="font-weight:bold; min-width:25px; display:inline-block; text-align:center;">\${p.stock}</span>
        <button class="stock-btn" onclick="updateStock(\${p.id}, 1)">+</button>
      </td>
      <td>
        <button class="btn btn-danger" onclick="deleteProduct(\${p.id})">🗑️ Delete</button>
      </td>
    </tr>\`).join('');
}

function previewProduct(id) {
  const p = products.find(x => x.id === id);
  if(!p) return;
  document.getElementById('adminViewImg').src = p.image;
  document.getElementById('adminViewName').textContent = p.name;
  document.getElementById('adminViewCat').textContent = p.cat;
  document.getElementById('adminViewPrice').textContent = '৳' + p.price;
  document.getElementById('adminViewStock').textContent = 'Live Stock: ' + p.stock + ' Items';
  document.getElementById('adminViewModal').classList.add('active');
}

function updateStock(id, change) {
  fetch('/admin/update-stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, change })
  })
  .then(res => res.json())
  .then(data => {
    if(data.success) {
      products = data.products;
      renderAdminProducts();
    }
  });
}

function deleteProduct(id) {
  if(confirm('Are you sure you want to delete this product?')) {
    fetch('/admin/delete-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        products = data.products;
        renderAdminProducts();
      }
    });
  }
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

loadDashboard();
</script>
</body>
</html>
    `);
});

// APIs
app.post('/admin/delete-product', (req, res) => {
    const { id } = req.body;
    products = products.filter(p => p.id !== parseInt(id));
    res.json({ success: true, products });
});

app.post('/admin/update-stock', (req, res) => {
    const { id, change } = req.body;
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
        product.stock = Math.max(0, product.stock + parseInt(change));
    }
    res.json({ success: true, products });
});

app.post('/admin/add-product', upload.single('product_image'), (req, res) => {
    const { name, price, cat } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/150';

    products.push({
        id: Date.now(),
        name,
        price: parseInt(price),
        old: parseInt(price) + 400,
        image: imageUrl,
        badge: 'New',
        cat,
        stock: 10,
        status: 'Active'
    });
    res.redirect('/admin');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
