const express = require("express")
const router = express.Router()
const estudiantesController = require("../controllers/estudianteController")
// el controlador de estudiantes

router.get("/", estudiantesController.obtenerEstudiantes)
router.post("/", estudiantesController.crearEstudiante)
router.get("/:idEstudiante", estudiantesController.obtenerEstudiantePorID)
router.put("/:idEstudiante",estudiantesController.actualizarEstudiente)
router.delete("/:idEstudiante", estudiantesController.eliminarEstudiante)

module.exports = router