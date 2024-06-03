const pool = require('../database')

//Get Address
async function getAddress(id) {
    try {
        if(id){
            const [result] = await pool.query(`
            SELECT * FROM address
            WHERE id = ?
            `,[id])
        
            return result;
        }else{
            const [result] = await pool.query(`SELECT * FROM address`);
            return result;
        }
        
    } catch (error) {
        console.error('Error Get Address:', error);
        throw error;
    }
}

//Create Address
async function createAddress(id,streetName,state,city,zipcode){
    try {
        const [result] = await pool.query(`
            INSERT INTO address (id,streetName,state,city,zipcode)
            VALUES(?,?,?,?,?)
            `,[id,streetName,state,city,zipcode])
        const foundAddress = await getAddress(id)
        return foundAddress;

    } catch (error) {
        console.error('Error Create Address:', error);
        throw error;
    }
}

//Update Address
async function UpdateAddress(id,streetName,state,city,zipcode){
    try {
        const [result] = await pool.query(`
            UPDATE address
            SET streetName = ?, state = ?,
            city = ?, zipcode = ?
            WHERE id = ?
        `,[streetName,state,city,zipcode,id])

        if(result.affectedRows){
            const updatedResult = await getAddress(id);
            return updatedResult
        }else{
            return {message:'No changes Made or Id not Found'};
        }

    } catch (error) {
        console.error('Error Update Address:', error);
        throw error;
    }
}

//Delete Address
async function DeleteAddress(id){
    try {
        const [result] = await pool.query(`
            DELETE FROM address
            WHERE id = ?
        `,[id])

        if(result.affectedRows){
            return {message:'Deleted Successful'}
        }else{
            return {message:'Failed To Delete or Id not Found'};
        }
    } catch (error) {
        console.error('Error Deleting Address:', error);
        throw error;
    }
}

module.exports = {
    getAddress,
    createAddress,
    UpdateAddress,
    DeleteAddress
}