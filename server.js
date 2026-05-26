const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Shinrai ওয়েবসাইটের হোম পেজ
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Shinrai E-commerce Admin Panel!</h1><p>আপনার ওয়েবসাইট সফলভাবে লাইভ হয়েছে।</p>');
});

// অ্যাডমিন ড্যাশবোর্ড রাউট (Route)
app.get('/admin', (req, res) => {
    res.json({
        message: "Welcome to Shinrai Admin Dashboard",
        status: "Active",
        owner: "Single Seller"
    });
});

app.listen(PORT, () => {
    console.log(`Shinrai server running on port ${PORT}`);
});
