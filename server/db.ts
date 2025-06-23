import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@shared/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://emparo-periperi-flash.aws-eu-west-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTA2OTg2ODcsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.2-O_tm8rGQIlKfN_xVhYXdGJlemapdyrysEJXm89Hr2BZJT5PUSdrUngFzhVLwi3IkV9C84oeQmHuX8xMOVGBw"
});

export const db = drizzle(client, { schema });