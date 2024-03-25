const mongoose = require("mongoose");

const DB = process.env.DATABASE

mongoose.connect("mongodb+srv://kmseneth:nEt25rs2OrW7wGoH@smartattendencesys.hp9bdbc.mongodb.net/jobs_db",{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=> console.log("DataBase Connected")).catch((errr)=>{
    console.log(errr);
})