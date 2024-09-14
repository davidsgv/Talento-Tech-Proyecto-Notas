const mongoose = require("mongoose")

const estudianteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        validate: {
            validator: function(nombre){
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/.test(nombre)
            },
            message: props => props.value + " no es un nombre valido"
        }
    },
    matricula:{
        type: Boolean,
        required: true,
        default: false
    },
    edad: Number,
});

module.exports = mongoose.model("estudiantes", estudianteSchema);