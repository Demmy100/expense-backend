const Income = require("../models/incomeModel");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const addIncome = asyncHandler(async (req, res) => {
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

    const income = await Income.create({
      title,
      amount,
      category,
      description,
      date: isoDate,
      user: req.user.id,
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Error creating income:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ user: req.user.id }).sort("-createdAt");
  if (!incomes) {
    res.status(400);
    throw new Error("No Income have been created");
  }
  res.status(200).json(incomes);
});

const getIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);
  if (!income) {
    res.status(404);
    throw new Error("Not found");
  }
  res.status(200).json(income);
});

const deleteIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Income.findByIdAndDelete(id);
  res.status(200).json({ message: "income succesfully deleted" });
});

module.exports = {
  addIncome,
  getIncomes,
  getIncome,
  deleteIncome,
};
