const request = require("supertest");
const app = require("../app");
const moongose = require("mongoose");
const Estudiante = require("../models/estudiante");
const jwt = require("jsonwebtoken");

const generarToken = ()=>{
    return jwt.sign({userId: "fakeUserID"}, "secretKey", {expiresIn: "1h"});
}

afterEach(async()=>{
    await Estudiante.deleteMany();
});

afterAll(async()=>{
    await moongose.connection.close();
})

describe("Crud Estudiante con jwt", ()=>{
    it("Deberia crear un nuevo estudiante", async ()=>{
        const token = generarToken();
        const res = await request(app)
            .post("/api/estudiantes")
            .set("Authorization", token)
            .send({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
        
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty("_id")
        expect(res.body.nombre).toBe("Juan Perez")
    })

    it("Test para obtener los estudiantes", async ()=>{
        try{
            await Estudiante.create({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
        }catch(error){
            console.error("Error al crear estudiante", error.message);
        }

        const token = generarToken();
        const res = await request(app)
            .get("/api/estudiantes").set("Authorization", token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
    });

    it("Test para obtener un estudiante por ID", async ()=>{
        let idEstudiante;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Patricia Lopez",
                matricula: true,
                edad: 30
            });

            idEstudiante = estudiante._id.toString();
        }catch(error){
            console.error("error al crear el estudiante", error)
        }

        const token = generarToken();
        const res = await request(app)
            .get(`/api/estudiantes/${idEstudiante}`).set("Authorization", token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe("Patricia Lopez")
    });

    it("test para actualizar estudiante por ID", async ()=>{
        let idEstudiante;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Patricia Lopez",
                matricula: false,
                edad: 30
            });

            idEstudiante = estudiante._id.toString();
        }catch(error){
            console.error("error al crear el estudiante", error)
        }

        const token = generarToken();
        const res = await request(app)
            .put(`/api/estudiantes/${idEstudiante}`)
            .set("Authorization", token)
            .send({
                nombre: "Juan Perez",
                matricula: true,
                edad: 22
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe("Juan Perez");
        expect(res.body.matricula).toEqual(true);
        expect(res.body.edad).toEqual(22);
    });


    it("test para eliminar estudiante por ID", async ()=>{
        let idEstudiante;
        try{
            const estudiante = await Estudiante.create({
                nombre: "Ana Martinez",
                matricula: false,
                edad: 24
            });

            idEstudiante = estudiante._id.toString();
        }catch(error){
            console.error("error al crear el estudiante", error)
        }

        const token = generarToken();
        const res = await request(app)
            .delete(`/api/estudiantes/${idEstudiante}`)
            .set("Authorization", token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Estudiante eliminado")
    });
});
