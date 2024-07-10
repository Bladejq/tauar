import pg from "pg";

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "38183121",
    port: 5432,
    database: "myshop"
})

export default pool;