const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const jwtMiddleware = require("./middlewares/authMiddleware")

const estudianteRouter = require("./routes/estudiante");
const materiaRouter = require("./routes/materia");
const authRouter = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    // .then(()=> console.log("Base de datos conectada"))
    .catch(err => console.error("No se pudo conectar a Mongo: ", err));

app.use("/api/estudiantes", jwtMiddleware, estudianteRouter);
app.use("/api/materias", jwtMiddleware, materiaRouter);
app.use("/api/auth", authRouter);

module.exports = app;