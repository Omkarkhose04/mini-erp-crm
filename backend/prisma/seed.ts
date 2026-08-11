import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const password = await bcrypt.hash("password123", 10);

    const users = [
        {
            name: "Admin User",
            email: "admin@test.com",
            role: "ADMIN" as const,
        },
        {
            name: "Sales User",
            email: "sales@test.com",
            role: "SALES" as const,
        },
        {
            name: "Warehouse User",
            email: "warehouse@test.com",
            role: "WAREHOUSE" as const,
        },
        {
            name: "Accounts User",
            email: "accounts@test.com",
            role: "ACCOUNTS" as const,
        },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password,
                role: user.role,
            },
        });
    }

    console.log("Seed users created successfully");
}

main()
    .catch((error) => {
        console.error("Seed error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });