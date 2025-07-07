{
    "name": "sales-inventory",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "postinstall": "prisma generate",
        "build": "prisma db push && next build",
        "dev": "next dev",
        "start": "next start"
    }
}
