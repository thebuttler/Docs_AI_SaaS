import {neon, neonConfig} from  '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

neonConfig.fetchConnectionCache = true 

if (!process.env.DATABASE_URL) {
    throw new Error('Database connection URL not found')
}

// fetch connection with the database url
const sql = neon(process.env.DATABASE_URL)

// export the database connection with drizzle
export const db = drizzle(sql)
