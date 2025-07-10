import { createPool }  from 'mysql2' //for more than 1 connections
import dotenv from 'dotenv';
dotenv.config();

//ye file sbse pehle chlri h 

const pool = createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 15,
    queueLimit : 0
}).promise(); 

export default pool;