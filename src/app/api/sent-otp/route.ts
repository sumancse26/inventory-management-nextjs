import prisma from '@/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type otpType = {
    otp: string;
    email: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: otpType = await req.json();

        if (!body.otp) {
            return NextResponse.json({ message: 'Otp is required' }, { status: 400 });
        }

        const user = await prisma.users.findUnique({
            where: { email: body.email }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        await prisma.users.update({
            where: { id: Number(user.id) },
            data: {
                otp: body.otp?.toString()
            }
        });

        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(String(error));
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
