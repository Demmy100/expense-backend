const Expense = require("../models/expenseModel");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const addExpense = asyncHandler(async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    const isoDate = moment(date, "DD-MM-YYYY").toISOString();

    if (!title || !amount || !category || !description || !date) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (amount <= 0 || !amount === "number") {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    console.log(req.body);

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date: isoDate,
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort("-createdAt");
  if (!expenses) {
    res.status(400);
    throw new Error("No Expense has been created");
  }
  res.status(200).json(expenses);
});

const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Not found");
  }
  res.status(200).json(expense);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.status(200).json({ message: "Expense succesfully deleted" });
});

module.exports = {
  addExpense,
  getExpenses,
  getExpense,
  deleteExpense,
};
