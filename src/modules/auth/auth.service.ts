import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import { userPayload } from "../../types/types";
import jwt from 'jsonwebtoken';
import config from "../../config";

// create user
const createUser = async (payload: userPayload) => {
    const { name, email, password, phone, role } = payload;
    // passwordhassing process
    const hashedPas = await bcrypt.hash(password as string, 10);
    // inser data to the databse
    const result = await pool.query(`INSERT INTO users(name, email, phone, role, password) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING id, name, email, phone, role`,
        [name, email, phone, role, hashedPas]);

    return result;
};

// login user
const loginUser = async (email: string, password:string) => {

    // check email
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    // if user not found
    if (result.rowCount === 0) {
        return null;
    }

    // check password
    const userInfo = result.rows[0];
    const matchedPass = await bcrypt.compare(password, userInfo.password);
    
    // userinfo
    const {password:userPass, created_at, updated_at, ...user} = userInfo;

    // if password didn't match
    if(!matchedPass){
        return false;
    }

    // if email and password mactched then generate jwt token
    const secret = config.jwt_secret;
    const token = jwt.sign({name:userInfo.name, email:userInfo.email, role:userInfo.role}, secret as string, {expiresIn: "3d"});
    

    return {token, user};

}


export const authServices = {
    createUser,
    loginUser
}