// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


const Worker = require('./models/Worker');


const app = express();
app.use(cors());
app.use(express.json());


// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Multer setup
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
filename: (req, file, cb) => {
const ext = path.extname(file.originalname);
const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
cb(null, name);
}
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit


// POST /api/workers — create a worker with image
app.post('/api/workers', upload.single('image'), async (req, res) => {
try {
const { name, email, skills, bio } = req.body;
const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
const worker = new Worker({ name, email, skills: skills ? skills.split(',').map(s => s.trim()) : [], bio, imagePath });
await worker.save();
res.status(201).json(worker);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


// GET /api/workers — list workers
app.get('/api/workers', async (req, res) => {
try {
const workers = await Worker.find().sort({ createdAt: -1 });
res.json(workers);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


// Simple health check
app.get('/api/ping', (req, res) => res.json({ ok: true }));


// Connect to DB & start
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/online_hiring_demo';


mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log('Server running on port', PORT));
})
.catch(err => console.error('MongoDB connection error', err));