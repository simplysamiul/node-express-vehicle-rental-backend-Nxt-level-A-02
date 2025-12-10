import { pool } from "../../config/db";


// get all users list
const getAllUsers = async ()=>{
    return await pool.query(`SELECT id, name, email, phone, role FROM users`);
};

// update a user by id
const updateAUser = async(payload:Record<string, unknown>, userId:string) =>{
    const { name, email, phone, role} = payload;
    return await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`, [name, email, phone, role, userId])
}

// delete a user by id
const deleteAUser = async (id:string) =>{
    return await pool.query(`DELETE FROM users WHERE id =$1`,[id]);
}


export const userServices = {
    getAllUsers,
    updateAUser,
    deleteAUser
} 