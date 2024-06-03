const fs = require('fs');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: 'notes',
    waitForConnections:true
}).promise();

const testConnection = async() => {
    try {
        const connection = await pool.getConnection();
        console.log('Database Connected');
        connection.release();
    } catch (err) {
        console.error('Error connecting Database:',err.stack);
    }
}

testConnection()

async function getNotes(id) {
    try {

        if(id) {
            const [result] = await pool.query(`
            SELECT * FROM notes
            WHERE id = ?
            `,[id])
        
            return result;
        }
        else{
            const [result] =await pool.query('SELECT * FROM notes')
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Note:', error);
        throw error;
    }

  
}

//Create
async function createNote(title,contents) {
    const [result] = await pool.query(`
    INSERT INTO notes (title,contents)
    VALUES(?,?)
    `,[title,contents])
    const getID = result.insertId;
    const searchResult = getNotes(getID)
    return searchResult;
}

//Update
async function UpdateNote(id, title, contents) {

    try {
        const [result] = await pool.query(`
        UPDATE notes
        SET title = ?, contents = ?
        WHERE id = ?
        `, [title, contents, id]);

        if(result.affectedRows){
            const updatedResult = await getNotes(id);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating Note:', error);
        throw error;
    }

}

//Delete
async function DeleteNote(id){
    try {
        const [result] = await pool.query(`
        DELETE FROM notes
        WHERE id = ?
        `,[id])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Note:', error);
        throw error;
    }
}

process.stdout.setEncoding('utf8');

async function main(params) {
    const data = `৭. ১ থেকে ২০ এর মধ্যে জোড় মৌলিক সংখ্যা কতটি?
    ক ৩টি   খ ২টি    ১টি   ঘ একটিও নয়
    ৮. ১, ৪,১৬ .... প্যাটার্নটির ষষ্ঠ সংখ্যাটি কত?
    ক ৮৪    খ ১১২   গ ২৫৬    ১০২৪`
    // const result = await createNote('bangla',data);
    const [result] = await getNotes(10);
    console.log(result.contents)
}

main();

// module.exports = {
//     getNotes,
//     createNote,
//     UpdateNote,
//     DeleteNote
// }