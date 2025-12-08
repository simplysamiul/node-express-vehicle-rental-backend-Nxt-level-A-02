import { Pool } from "pg";
import config from ".";


const pool = new Pool({
    connectionString: `${config.connection_str}`
});

const initDb = async () => {

    // users table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

        // vehicles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(300) NOT NULL,
            type VARCHAR(15) NOT NULL,
            registration_number VARCHAR(30) UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) DEFAULT 'available',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)

            // bookings table
        await pool.query(`
            
            CREATE TABLE IF NOT EXIST bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            CHECK (rent_end_date > rent_start_date),
            total_price NUMERIC(10,2) GENERATED ALWAYS AS (
                (rent_end_date - rent_start_date) * (SELECT v.daily_rent_price FROM vehicles v WHERE v.id = vehicle_id)
            )STORED,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
};

initDb();


export { pool, initDb };