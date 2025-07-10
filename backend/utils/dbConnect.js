import { createPool }  from 'mysql2' //for more than 1 connections
import dotenv from 'dotenv';
dotenv.config();

//ye file sbse pehle chlri h 

const pool = createPool({
    host : "127.0.0.1",
    user : "root",
    password : process.env.DB_PASSWORD,
    database : "code1sthealthcare",
    waitForConnections : true,
    connectionLimit : 35,
    queueLimit : 0
}).promise(); 

export default pool;