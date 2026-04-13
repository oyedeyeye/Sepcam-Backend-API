import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

let adapter;
if (process.env.NODE_ENV !== 'test') {
  const connectionString = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/sepcam_db";
  adapter = new PrismaMariaDb(connectionString);
}

export const prisma = new PrismaClient(adapter ? { adapter } : undefined);
