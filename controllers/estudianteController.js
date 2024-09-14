const Estudiante = require("../models/estudiante")

exports.obtenerEstudiantes = async (req,res) =>{
    try{
        const estudiantes = await Estudiante.find();
        res.status(200).json(estudiantes)
    } catch (error){
        res.status(500).json({error: error.message})
    }
}

exports.crearEstudiante = async (req,res)=>{
    console.log("crear estudiante", req.body)

    try{
        const nuevoEstudiante = new Estudiante(req.body)
        await nuevoEstudiante.save()
        res.status(201).json(nuevoEstudiante)
    } catch (error){
        res.status(500).json({error: error.message})
    }
}

exports.obtenerEstudiantePorID = async (req,res)=>{
    try{
        const estudiante = await Estudiante.findById(req.params.idEstudiante);
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        res.status(200).json(estudiante);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

exports.actualizarEstudiente = async (req,res)=>{
    const idEstudiante = req.params.idEstudiante

    try{
        const estudiante = await Estudiante.findByIdAndUpdate(idEstudiante, req.body, {new:true});
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        res.status(200).json(estudiante);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

exports.eliminarEstudiante = async (req,res)=>{
    const idEstudiante = req.params.idEstudiante
    try{
        const estudiante = await Estudiante.findByIdAndDelete(idEstudiante, req.body, {new:true});
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        res.status(200).json({message: "Estudiante eliminado"});
    } catch(error){
        res.status(500).json({error: error.message});
    }
}