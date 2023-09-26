import {config} from "dotenv"

config()
export default {
  DELIVERY_URL: process.env.DELIVERY_URL ?? "",
  DB: {
    USER: process.env.DB_USER ?? "",
    HOST: process.env.DB_HOST ?? "",
    NAME: process.env.DB_NAME ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    PORT: Number(process.env.DB_PORT) || 5432,
  },
  HEALTH_CHECK_PORT: Number(process.env.HEALTH_CHECK_PORT) || 3000
}
