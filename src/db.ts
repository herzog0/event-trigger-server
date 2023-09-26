import {Client} from "pg";
import env from "./env";

const client = new Client({
  user: env.DB.USER,
  host: env.DB.HOST,
  database: env.DB.NAME,
  password: env.DB.PASSWORD,
  port: env.DB.PORT,
});

export default client
