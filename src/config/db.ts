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
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(15) ,
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
            `);

    // trigger function

    await pool.query(`
            DROP TRIGGER IF EXISTS update_total_price_trigger ON bookings;
            `);

    await pool.query(`
            DROP FUNCTION IF EXISTS calculate_total_price() CASCADE;
            `);
    await pool.query(`
            CREATE OR REPLACE FUNCTION calculate_total_price()
            RETURNS TRIGGER AS $$
            DECLARE
            daily_price INT;
            total_days INT;
            BEGIN
            -- Get the vehicle's daily rent price
            SELECT v.daily_rent_price INTO daily_price
            FROM vehicles v
            WHERE v.id = NEW.vehicle_id;

            -- Calculate total days
            total_days := (NEW.rent_end_date - NEW.rent_start_date);

            -- Calculate total price
            NEW.total_price := total_days * daily_price;

            RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    // bookings table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            CHECK (rent_end_date > rent_start_date),
            total_price NUMERIC(10,2),
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

    // update trigger function
    await pool.query(`
        CREATE TRIGGER update_total_price_trigger
        BEFORE INSERT OR UPDATE ON bookings
        FOR EACH ROW
        EXECUTE FUNCTION calculate_total_price();
    `);
};


export { pool, initDb };