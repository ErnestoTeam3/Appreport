import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || "");

export const db = {
  query: async (queryString: string, params: any[] = []) => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no definida en .env.local");
    }
    
    // CORRECCIÓN: Usamos sql.query para llamadas con parámetros ($1, $2)
    const rows = await sql.query(queryString, params);
    
    return { rows };
  }
};