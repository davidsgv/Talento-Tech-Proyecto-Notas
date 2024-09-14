const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

usuarioSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(error){
        next(error);
    }
});

usuarioSchema.methods.comparePassword = async (enteredPassword)=>{
    return await bcrypt.compare(enteredPassword, this.password)
}

const Usuario = mongoose.model("usuario", usuarioSchema);

module.exports = Usuario