const pool = require('../database')

//Get Admin
async function getAdmin(username) {
    try {

        if(username) {
            const [result] = await pool.query(`
            SELECT * FROM admin
            WHERE username = ?
            `,[username])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM admin`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Getting Admin :', error);
        throw error;
    }

}

//Create Admin
async function createAdmin(username,pass_key,securekey,Full_name) {
    try {
        const [result] = await pool.query(`
            INSERT INTO admin (username,pass_key,securekey,Full_name)
            VALUES(?,?,?,?)
        `,[username,pass_key,securekey,Full_name])

        const searchResult = await getAdmin(username)
        return searchResult;

    } catch (error) {
        console.error('Error Creating Admin:', error);
        throw error;
    }
}


//Update Admin
async function UpdateAdmin(username,pass_key,securekey,Full_name) {
    console.log({username,pass_key,securekey,Full_name})
    try {
        const [result] = await pool.query(`
            UPDATE admin
            SET pass_key = ? , securekey = ?,
            Full_name = ?
            WHERE username = ?
        `,[pass_key,securekey,Full_name,username])

        if(result.affectedRows){
            const updatedResult = await getAdmin(username);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating admin:', error);
        throw error;
    }
}

//Delete Admin
async function DeleteAdmin(username){
    try {
        const [result] = await pool.query(`
        DELETE FROM admin
        WHERE username = ?
        `,[username])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Admin:', error);
        throw error;
    }
}

module.exports = {
    getAdmin,
    createAdmin,
    UpdateAdmin,
    DeleteAdmin
}