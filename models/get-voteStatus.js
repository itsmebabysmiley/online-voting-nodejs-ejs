const dbConnection = require("../config/dbConnect");

module.exports = (email) => {
    return new Promise(
        async (resolve, reject)=>{
            let connection = await dbConnection();
            connection.query("SELECT voted FROM users WHERE email = ?", email, (err, result)=>{
                if(err) reject (err);
                return resolve(result);
            }); 
        }
    )
}

// promise: https://stackoverflow.com/questions/36547292/use-promise-to-process-mysql-return-value-in-node-js