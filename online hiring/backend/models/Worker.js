const mongoose = require('mongoose');


const WorkerSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true },
skills: { type: [String], default: [] },
bio: { type: String },
imagePath: { type: String },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Worker', WorkerSchema);