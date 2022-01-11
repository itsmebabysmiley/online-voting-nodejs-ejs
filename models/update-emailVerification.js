const dbConnection = require("../config/dbConnect");

module.exports = async (email) =>{
    return new Promise(
        async (resolve, reject)=>{
            let connection = await dbConnection();
            connection.query("UPDATE users SET emailVerified = ? WHERE email = ?", ['true', email], (err, result)=>{
                if(err) reject (err);
                return resolve(result.changedRows);
            }); 
        }
    )
}