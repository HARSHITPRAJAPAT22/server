import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/student.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret";

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({ name, email, password: hashedPassword });
    await newStudent.save();

    const token = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET , { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup." });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET , { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// ✅ Get All Students (Protected)
router.get("/students", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students." });
  }
});

// ✅ Get Student by ID (Protected)
router.get("/student/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student details." });
  }
});

export default router;
