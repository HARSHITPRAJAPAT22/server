// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// const authRoutes = require('./routes/auth');
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
} catch (error) {
  console.error("MongoDB connection error:", error.message);
}


app.listen(3000, () => console.log("Server running on port 3000"));
