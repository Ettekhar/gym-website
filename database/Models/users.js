const pool = require('../database')

//Get user
async function getUser(id) {
    try {

        if(id) {
            const [result] = await pool.query(`
            SELECT * FROM users
            WHERE userid = ?
            `,[id])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM users`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Users:', error);
        throw error;
    }

}

// Get user By Dates
async function getUserByDate(month,year) {
    try {
        if(month && year) {
            const [result] = await pool.query(`
            SELECT
                *
            FROM
                users
            WHERE
                MONTH(joining_date) = ? AND YEAR(joining_date) = ?
            `,[month,year])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM users`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Users:', error);
        throw error;
    }

}

//Create User
async function createUser(userid,username,gender,mobile,email,dob,joining_date) {
    try {
        const [result] = await pool.query(`
            INSERT INTO users (userid,username,gender,mobile,email,dob,joining_date)
            VALUES(?,?,?,?,?,?,?)
        `,[userid,username,gender,mobile,email,dob,joining_date])

        const searchResult = await getUser(userid)
        return searchResult;

    } catch (error) {
        console.error('Error Create User:', error);
        throw error;
    }
}


//Update User
async function UpdateUser(userid,username,gender,mobile,email,dob,joining_date) {
    try {
        const [result] = await pool.query(`
            UPDATE users
            SET username = ?, gender = ? , mobile = ?,
            email = ?, dob = ?, joining_date = ?
            WHERE userid = ?
        `,[username,gender,mobile,email,dob,joining_date,userid])

        if(result.affectedRows){
            const updatedResult = await getUser(userid);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating User:', error);
        throw error;
    }
}

//Delete User
async function DeleteUser(userid){
    try {
        const [result] = await pool.query(`
        DELETE FROM users
        WHERE userid = ?
        `,[userid])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting User:', error);
        throw error;
    }
}


module.exports = {
    getUser,
    getUserByDate,
    createUser,
    UpdateUser,
    DeleteUser
}