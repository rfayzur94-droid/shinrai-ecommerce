const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// প্রফেশনাল AliExpress স্টাইল হোমপেজ (HTML/CSS)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shinrai | Best Online Shopping Marketplace</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            body { background-color: #f4f4f4; color: #333; }
            
            /* Header */
            header { background-color: #FF4747; color: white; padding: 15px 50px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
            .logo { font-size: 26px; font-weight: bold; letter-spacing: 1px; }
            .search-bar { width: 50%; display: flex; }
            .search-bar input { width: 100%; padding: 10px; border: none; border-radius: 4px 0 0 4px; outline: none; }
            .search-bar button { padding: 10px 20px; background: #222; color: white; border: none; border-radius: 0 4px 4px 0; cursor: pointer; }
            .nav-links a { color: white; text-decoration: none; margin-left: 20px; font-weight: 500; }

            /* Banner Section */
            .banner { background: linear-gradient(135deg, #FF4747, #ff7676); color: white; padding: 60px 50px; text-align: center; margin-bottom: 30px; }
            .banner h1 { font-size: 42px; margin-bottom: 10px; }
            .banner p { font-size: 18px; opacity: 0.9; }

            /* Main Container */
            .container { padding: 0 50px 50px 50px; }
            .section-title { font-size: 22px; margin-bottom: 20px; border-left: 5px solid #FF4747; padding-left: 10px; }

            /* Product Grid */
            .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
            .product-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: 0.3s; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; }
            .product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .product-img { width: 100%; height: 180px; background: #eee; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: bold; margin-bottom: 15px; }
            .product-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; height: 40px; overflow: hidden; }
            .product-price { color: #FF4747; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .buy-btn { background: #FF4747; color: white; text-align: center; padding: 8px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; transition: 0.2s; }
            .buy-btn:hover { background: #e03e3e; }
        </style>
    </head>
    <body>

        <!-- Top Navigation Bar -->
        <header>
            <div class="logo">Shinrai</div>
            <div class="search-bar">
                <input type="text" placeholder="AliExpress এর মতো প্রোডাক্ট খুঁজুন...">
                <button>Search</button>
            </div>
            <div class="nav-links">
                <a href="#">Home</a>
                <a href="/admin">Dashboard</a>
                <a href="#">Cart (0)</a>
            </div>
        </header>

        <!-- Flash Sale Banner -->
        <div class="banner">
            <h1>Welcome to Shinrai Marketplace</h1>
            <p>১০০% বিশ্বস্ততায় সেরা গ্যাজেট এবং লাইফস্টাইল প্রোডাক্ট কিনুন সাশ্রয়ী মূল্যে।</p>
        </div>

        <!-- Trending Products Section -->
        <div class="container">
            <h2 class="section-title">Trending Products (চলতি ট্রেন্ড)</h2>
            <div class="product-grid">
                
                <!-- Product 1 -->
                <div class="product-card">
                    <div class="product-img">Smart Watch T800</div>
                    <div class="product-title">T800 Ultra Smartwatch with Wireless Charging</div>
                    <div class="product-price">৳ ১,২০০</div>
                    <a href="#" class="buy-btn">Order Now</a>
                </div>

                <!-- Product 2 -->
                <div class="product-card">
                    <div class="product-img">Wireless Earbuds</div>
                    <div class="product-title">Pro 4 Wireless Bluetooth Earbuds High Bass</div>
                    <div class="product-price">৳ ৮৫০</div>
                    <a href="#" class="buy-btn">Order Now</a>
                </div>

                <!-- Product 3 -->
                <div class="product-card">
                    <div class="product-img">Power Bank 20k</div>
                    <div class="product-title">Fast Charging 20000mAh Power Bank Slim Design</div>
                    <div class="product-price">৳ ১,৮৫০</div>
                    <a href="#" class="buy-btn">Order Now</a>
                </div>

                <!-- Product 4 -->
                <div class="product-card">
                    <div class="product-img">RGB Desk Lamp</div>
                    <div class="product-title">Smart Motion Sensor RGB LED Desk Night Lamp</div>
                    <div class="product-price">৳ ৯50</div>
                    <a href="#" class="buy-btn">Order Now</a>
                </div>

            </div>
        </div>

    </body>
    </html>
    `);
});

// আপনার প্রফেশনাল অ্যাডমিন প্যানেল রাউট (JSON API)
app.get('/admin', (req, res) => {
    res.json({
        store_name: "Shinrai",
        owner: "Single Seller",
        total_products: 4,
        total_orders: 0,
        active_status: "Operational"
    });
});

app.listen(PORT, () => {
    console.log(`Shinrai server running on port ${PORT}`);
});
