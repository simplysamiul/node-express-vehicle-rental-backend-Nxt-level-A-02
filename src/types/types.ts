// type declare for user object 
export type userPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
}


// booking object 
export type BookingBody = {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
}