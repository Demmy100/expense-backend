const express = require("express");
const {
  addIncome,
  getIncomes,
  getIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const {
  getExpenses,
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

//router.post("/add-income", addIncome)
router
  .get("/get-incomes", protect, getIncomes)
  .post("/add-income", protect, addIncome)
  .get("/get-income/:id", protect, getIncome)
  .delete("/delete-income/:id", protect, deleteIncome);
router
  .get("/get-expenses", protect, getExpenses)
  .post("/add-expense", protect, addExpense)
  .get("/get-expense/:id", protect, getExpense)
  .delete("/delete-expense/:id", protect, deleteExpense);
//router.get("/get-income/:id", getIncome)
//router.delete("/delete-income/:id", deleteIncome)

module.exports = router;
