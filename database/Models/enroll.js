const pool = require('../database')

//Get Enroll
async function getEnroll(et_id) {
    try {

        if(et_id) {
            const [result] = await pool.query(`
            SELECT * FROM enrolls_to
            WHERE et_id = ?
            `,[et_id])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM enrolls_to`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Enroll:', error);
        throw error;
    }

}

async function getEnrollByUid(et_id,renewal) {
    try {

        if(et_id) {
            const [result] = await pool.query(`
            SELECT * FROM enrolls_to
            WHERE uid = ? AND renewal = ?
            `,[et_id,renewal])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM enrolls_to`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Enroll:', error);
        throw error;
    }

}

//Create Enroll
async function createEnroll(pid,uid,paid_date,expire,renewal) {
    try {
        const [result] = await pool.query(`
            INSERT INTO enrolls_to (pid,uid,paid_date,expire,renewal)
            VALUES(?,?,?,?,?)
        `,[pid,uid,paid_date,expire,renewal])

        const getID = result.insertId;
        const searchResult = await getEnroll(getID)
        return searchResult;

    } catch (error) {
        console.error('Error Create Enroll:', error);
        throw error;
    }
}


//Update Enroll
async function UpdateEnroll(et_id,pid,uid,paid_date,expire,renewal) {
    try {
        const [result] = await pool.query(`
            UPDATE enrolls_to
            SET pid = ?, uid = ? , paid_date = ?,
            expire = ?, renewal = ?
            WHERE et_id = ?
        `,[pid,uid,paid_date,expire,renewal,et_id])

        if(result.affectedRows){
            const updatedResult = await getEnroll(et_id);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating Enroll:', error);
        throw error;
    }
}

//Delete Enroll
async function DeleteEnroll(et_id){
    try {
        const [result] = await pool.query(`
        DELETE FROM enrolls_to
        WHERE et_id = ?
        `,[et_id])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Enroll:', error);
        throw error;
    }
}

module.exports = {
    getEnroll,
    getEnrollByUid,
    createEnroll,
    UpdateEnroll,
    DeleteEnroll
}

