import express, { Request, Response } from "express";

const app = express();

// parser
app.use(express.json());

// root route
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})



export default app;