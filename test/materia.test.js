const request = require("supertest");
const app = require("../app");
const moongose = require("mongoose");
const Estudiante = require("../models/estudiante")
const Materia = require("../models/materia");
const jwt = require("jsonwebtoken");

const generarToken = ()=>{
    return jwt.sign({userId: "fakeUserID"}, "secretKey", {expiresIn: "1h"});
}

afterEach(async()=>{
    await Materia.deleteMany();
    await Estudiante.deleteMany();
});

afterAll(async()=>{
    await moongose.connection.close();
})

describe("Crud Materia con jwt", ()=>{
    it("Deberia crear una nueva materia", async ()=>{
        const token = generarToken();
        const res = await request(app)
            .post("/api/materias")
            .set("Authorization", token)
            .send({
                "nombre": "Desarrollo",
                "estudiantes": [],
                "profesor": "Javier"
            });
        
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty("_id")
        expect(res.body.nombre).toBe("Desarrollo")
        expect(res.body.profesor).toBe("Javier")
    })

    it("Test para obtener las materias", async ()=>{
        try{
            const estudiante = await Estudiante.create({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
            await Materia.create({
                nombre: "Estructura de Datos",
                profesor: "Natalia",
                estudiantes: [estudiante._id]
            })
        }catch(error){
            console.error("Error al crear el estudiante y la materia", error.message);
        }

        const token = generarToken();
        const res = await request(app)
            .get("/api/materias").set("Authorization", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
    });

    it("Test para obtener una materia por ID", async ()=>{
        let idMateria;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
            const materia = await Materia.create({
                nombre: "Estructura de Datos",
                profesor: "Natalia",
                estudiantes: [estudiante._id]
            })

            idMateria = materia._id;
        }catch(error){
            console.error("error al crear el estudiante y la materia", error)
        }

        const token = generarToken();
        const res = await request(app)
            .get(`/api/materias/${idMateria}`).set("Authorization", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe("Estructura de Datos");
        expect(res.body.profesor).toBe("Natalia");
        expect(res.body.estudiantes[0].nombre).toBe("Juan Perez");
    });

    it("test para actualizar materia por ID", async ()=>{
        let idMateria;
        let idEstudiante;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
            const materia = await Materia.create({
                nombre: "Estructura de Datos",
                profesor: "Natalia",
                estudiantes: [estudiante._id]
            })

            idEstudiante = estudiante._id;
            idMateria = materia._id;
        }catch(error){
            console.error("error al crear el estudiante y la materia", error)
        }

        const token = generarToken();
        const res = await request(app)
            .put(`/api/materias/${idMateria}`)
            .set("Authorization", token)
            .send({
                nombre: "POO",
                profesor: "Leona"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe("POO");
        expect(res.body.profesor).toBe("Leona");
        expect(res.body.estudiantes[0]).toBe(idEstudiante.toString());
    });


    it("test para eliminar materia por ID", async ()=>{
        let idMateria;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
            const materia = await Materia.create({
                nombre: "Estructura de Datos",
                profesor: "Natalia",
                estudiantes: [estudiante._id]
            })

            idMateria = materia._id;
        }catch(error){
            console.error("error al crear el estudiante y la materia", error)
        }

        const token = generarToken();
        const res = await request(app)
            .delete(`/api/materias/${idMateria}`)
            .set("Authorization", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Materia eliminada")
    });
});