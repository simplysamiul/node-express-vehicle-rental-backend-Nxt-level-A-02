import { pool } from "../../config/db";


// create vehicle 
const createVehicle = async (payload:Record<string,unknown>)=>{
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;
    const result = await pool.query(`INSERT INTO vehicles 
        (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`, 
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

        return result;
};

// get all vehicles
const getAllVehicles = async ()=>{
    return await pool.query(`SELECT * FROM vehicles`)
};

// get vehicle by id 
const getSingleVehicle = async(id:string) =>{
    return await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
        FROM vehicles WHERE id=$1`, [id])
};

// update vehicle by id 
const updateSingleVehicle = async (payload:Record<string, unknown>, id:string)=>{
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;
    const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
        WHERE id=$6 RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`, 
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    return result;
}


export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateSingleVehicle
}