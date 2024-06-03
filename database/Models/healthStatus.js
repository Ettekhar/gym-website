const pool = require('../database')

//Get Health Status
async function getHealthStatus(hid) {
    try {

        if(hid) {
            const [result] = await pool.query(`
            SELECT * FROM health_status
            WHERE hid = ?
            `,[hid])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM health_status`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get :', error);
        throw error;
    }

}

async function getHealthStatusByUid(uid) {
    try {

        if(uid) {
            const [result] = await pool.query(`
            SELECT * FROM health_status
            WHERE uid = ?
            `,[uid])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM health_status`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get :', error);
        throw error;
    }

}

//Create HealthStatus
async function createHealthStatus(calorie,height,weight,fat,remarks,uid) {
    try {
        const [result] = await pool.query(`
            INSERT INTO health_status (calorie,height,weight,fat,remarks,uid)
            VALUES(?,?,?,?,?,?)
        `,[calorie,height,weight,fat,remarks,uid])

        const getID = result.insertId;
        const searchResult = await getHealthStatus(getID)
        return searchResult;

    } catch (error) {
        console.error('Error Create Health Status:', error);
        throw error;
    }
}


//Update Health Status
async function UpdateHealthStatus(uid,calorie,height,weight,fat,remarks) {
    try {
        const [result] = await pool.query(`
            UPDATE health_status
            SET calorie = ?, height = ? , weight = ?,
            fat = ?, remarks = ?
            WHERE uid = ?
        `,[calorie,height,weight,fat,remarks,uid])

        if(result.affectedRows){
            const updatedResult = await getHealthStatusByUid(uid);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating Health Status:', error);
        throw error;
    }
}

async function UpdateHealthStatusByHid(hid,calorie,height,weight,fat,remarks,uid) {
    try {
        const [result] = await pool.query(`
            UPDATE health_status
            SET calorie = ?, height = ? , weight = ?,
            fat = ?, remarks = ?, uid = ?
            WHERE hid = ?
        `,[calorie,height,weight,fat,remarks,uid,hid])

        if(result.affectedRows){
            const updatedResult = await getHealthStatus(hid);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating Health Status:', error);
        throw error;
    }
}


//Delete Health Status
async function DeleteHealthStatus(hid){
    try {
        const [result] = await pool.query(`
        DELETE FROM health_status
        WHERE hid = ?
        `,[hid])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Health Status:', error);
        throw error;
    }
}


module.exports = {
    getHealthStatus,
    createHealthStatus,
    UpdateHealthStatus,
    UpdateHealthStatusByHid,
    DeleteHealthStatus
}