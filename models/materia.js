const moongose = require("mongoose");

const materiaSchema = new moongose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    estudiantes: [{
        type: moongose.Schema.Types.ObjectId,
        ref: "estudiantes",
    }],
    profesor: {
        type: String,
        required: true,
    }
});

const Materia = moongose.model("materia", materiaSchema);
module.exports = Materia;