const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const router = require("./router");
const errorMiddleware = require("./middlewares/errorMiddleware");

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () =>console.log(`Server started on port ${PORT}`));
    }catch(e){
        console.error(e);
    }
}

start()