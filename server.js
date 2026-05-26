const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ডেটাবেজ (সাময়িক)
let products = [
    { id: 1, title: "T800 Ultra Smartwatch", price: 1200, img: "Smart Watch T800" },
    { id: 2, title: "Pro 4 Wireless Earbuds", price: 850, img: "Wireless Earbuds" },
    { id: 3, title: "20000mAh Power Bank", price: 1850, img: "Power Bank 20k" },
    { id: 4, title: "Smart RGB Desk Lamp", price: 950, img: "RGB Desk Lamp" }
];
let orders = [];

// ======= ১. কাস্টমারদের জন্য মূল ওয়েবসাইট =======
app.get('/', (req, res) => {
    let productHTML = '';
    for(let i=0; i<products.length; i++) {
        let p = products[i];
        productHTML += `
        <div class="product-card">
            <div class="product-img">` + p.img + `</div>
            <div class="product-title">` + p.title + `</div>
            <div class="product-price">৳ ` + p.price + `</div>
            <button class="buy-btn" onclick="openOrderModal('` + p.title + `', ` + p.price + `)">Buy Now (কিনুন)</button>
        </div>`;
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shinrai | Marketplace</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
            body { background: #f5f5f5; }
            header { background: #FF4747; color: white; padding: 15px 50px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; }
            .container { padding: 20px 50px; margin-top: 10px; }
            .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
            .product-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
            .product-img { height: 150px; background: #eee; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; font-weight: bold; color: #888; }
            .product-title { font-weight: bold; margin-bottom: 10px; height: 40px; }
            .product-price { color: #FF4747; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .buy-btn { background: #FF4747; color: white; border: none; padding: 10px; width: 100%; border-radius: 4px; cursor: pointer; font-weight: bold; }
            
            /* Order Form Modal */
            #orderModal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index: 999; }
            .modal-content { background:white; padding:30px; border-radius:8px; width:400px; }
            .modal-content input, .modal-content select { width:100%; padding:10px; margin: 10px 0; border: 1px solid #ccc; border-radius:4px; }
            .submit-btn { background:#28a745; color:white; border:none; padding:10px; width:100%; font-weight:bold; cursor:pointer; margin-top: 10px; }
            .close-btn { background:#ccc; margin-top:5px; color: #333; }
        </style>
    </head>
    <body>
        <header>
            <div class="logo">Shinrai</div>
            <div><a href="/admin" style="color:white; text-decoration:none; font-weight:bold;">Admin Dashboard 📊</a></div>
        </header>
        <div class="container">
            <h2 style="margin-bottom:20px;">Trending Products</h2>
            <div class="product-grid">` + productHTML + `</div>
        </div>

        <!-- Checkout Form Modal -->
        <div id="orderModal">
            <div class="modal-content">
                <h3 id="modalProductTitle">Order Form</h3>
                <form action="/place-order" method="POST">
                    <input type="hidden" name="productTitle" id="hiddenProductTitle">
                    <input type="hidden" name="productPrice" id="hiddenProductPrice">
                    
                    <input type="text" name="customerName" placeholder="আপনার নাম (Your Name)" required>
                    <input type="text" name="customerPhone" placeholder="মোবাইল নাম্বার (Mobile Number)" required>
                    <input type="text" name="customerAddress" placeholder="পূর্ণ ঠিকানা (Full Delivery Address)" required>
                    
                    <label>পেমেন্ট পদ্ধতি:</label>
                    <select name="paymentMethod">
                        <option value="Cash On Delivery">Cash On Delivery (ক্যাশ অন ডেলিভারি)</option>
                        <option value="bKash">bKash (বিকাশ ম্যানুয়াল)</option>
                    </select>
                    <button type="submit" class="submit-btn">Confirm Order (অর্ডার নিশ্চিত করুন)</button>
                    <button type="button" class="submit-btn close-btn" onclick="closeModal()">Cancel</button>
                </form>
            </div>
        </div>

        <script>
            function openOrderModal(title, price) {
                document.getElementById('orderModal').style.display = 'flex';
                document.getElementById('modalProductTitle').innerText = "Buy: " + title + " (৳" + price + ")";
                document.getElementById('hiddenProductTitle').value = title;
                document.getElementById('hiddenProductPrice').value = price;
            }
            function closeModal() { document.getElementById('orderModal').style.display = 'none'; }
        </script>
    </body>
    </html>
    `);
});

// ======= ২. অর্ডার প্লেস করার ব্যাকএন্ড =======
app.post('/place-order', (req, res) => {
    const { productTitle, productPrice, customerName, customerPhone, customerAddress, paymentMethod } = req.body;
    orders.push({
        id: orders.length + 1,
        productTitle,
        productPrice,
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        date: new Date().toLocaleString()
    });
    res.send('<h1>Order Successful! আপনার অর্ডারটি গ্রহণ করা হয়েছে।</h1><a href="/">ফিরে যান</a>');
});

// ======= ৩. আপনার নিজের জন্য অ্যাডমিন ড্যাশবোর্ড =======
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
            th { background:#FF4747; color:white; }
            .btn { background:#28a745; color:white; padding:10px 15px; border:none; border-radius:4px; cursor:pointer; font-weight:bold; text-decoration:none; }
        </style>
    </head>
    <body>
        <h2>📊 Shinrai Admin Dashboard (মালিকের প্যানেল)</h2>
        <br>
        <div class="card">
            <h3>➕ নতুন প্রোডাক্ট যোগ করুন (Add Product)</h3>
            <form action="/admin/add-product" method="POST" style="margin-top:10px;">
                <input type="text" name="title" placeholder="Product Name" style="padding:8px; width:200px;" required>
                <input type="number" name="price" placeholder="Price" style="padding:8px; width:100px;" required>
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
                        <th>Product</th>
                        <th>Price</th>
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

// ======= ৪. নতুন প্রোডাক্ট অ্যাড করার ব্যাকএন্ড =======
app.post('/admin/add-product', (req, res) => {
    const { title, price } = req.body;
    products.push({
        id: products.length + 1,
        title,
        price: parseInt(price),
        img: "New Product Box"
    });
    res.redirect('/admin');
});

app.listen(PORT, () => {
    console.log(`Shinrai server running on port ${PORT}`);
});
