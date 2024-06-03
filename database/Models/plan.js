const pool = require('../database')

//Get Plan
async function getPlan(pid) {
    try {

        if(pid) {
            const [result] = await pool.query(`
            SELECT * FROM Plan
            WHERE pid = ?
            `,[pid])
            return result;
        }
        else{
            const result = await pool.query(`SELECT * FROM Plan`)
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Plan:', error);
        throw error;
    }

}

//Create Plan
async function createPlan(pid,planName,description,validity,amount,active) {
    try {
        const [result] = await pool.query(`
            INSERT INTO Plan (pid,planName,description,validity,amount,active)
            VALUES(?,?,?,?,?,?)
        `,[pid,planName,description,validity,amount,active])

        const searchResult = await getPlan(pid)
        return searchResult;

    } catch (error) {
        console.error('Error Create Plan:', error);
        throw error;
    }
}


//Update Plan
async function UpdatePlan(pid,planName,description,validity,amount,active) {
    try {
        const [result] = await pool.query(`
            UPDATE Plan
            SET planName = ?, description = ? , validity = ?,
            amount = ?, active = ?
            WHERE pid = ?
        `,[planName,description,validity,amount,active,pid])

        if(result.affectedRows){
            const updatedResult = await getPlan(pid);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Updating Plan:', error);
        throw error;
    }
}

//Delete Plan
async function DeletePlan(pid){
    try {
        const [result] = await pool.query(`
        DELETE FROM Plan
        WHERE pid = ?
        `,[pid])
        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Plan:', error);
        throw error;
    }
}

module.exports = {
    getPlan,
    createPlan,
    UpdatePlan,
    DeletePlan
}
