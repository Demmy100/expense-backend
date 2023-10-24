const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const app = express();
const { readdirSync } = require("fs");

app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "https://expense-frontend-two.vercel.app/"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* app.get("/", (req, res) => {
  res.send("Hello World");
}); */
app.use("/api/track/v1/users", require("./routes/userRoute"));
app.use("/api/track/v1", require("./routes/allRoutes"));

//readdirSync("./routes").map((route) => app.use("/api/v1", require("./routes/" + route)))

app.use(errorHandler);

//mongodb connection
const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log("App listening on port:", port);
    });
  })
  .catch((err) => console.log(err));

//zL9MdXlZWpgW7EnZ
//demilade6
//mongodb+srv://demilade6:zL9MdXlZWpgW7EnZ@cluster0.yibyptj.mongodb.net/mern-expense?retryWrites=true&w=majority
