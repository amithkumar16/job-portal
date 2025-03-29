import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    image: {
        type: String,
        required: true // This should be a URL or file path
    },
    password: {
        type: String,
        required: true,

    },
})

const Company = mongoose.model('Company', companySchema);

export default Company;