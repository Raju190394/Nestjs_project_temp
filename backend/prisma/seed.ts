import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    // Create Admin
    await prisma.user.upsert({
        where: { email: 'admin@nexus.com' },
        update: {},
        create: {
            email: 'admin@nexus.com',
            password: adminPassword,
            firstName: 'System',
            lastName: 'Admin',
            role: Role.ADMIN,
        },
    });

    // Create Standard User
    await prisma.user.upsert({
        where: { email: 'user@nexus.com' },
        update: {},
        create: {
            email: 'user@nexus.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: Role.USER,
        },
    });

    console.log('✅ Database seeded with Admin and User accounts.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
