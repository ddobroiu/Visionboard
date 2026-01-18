const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'd_dobroiu@yahoo.com';
    const users = await prisma.user.updateMany({
        where: { email },
        data: { role: 'admin' },
    });
    console.log(`Promoted ${users.count} users with email ${email} to admin.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
