import prisma from '@/config/prisma';
import { encryptPassword } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ResetPasswordType = {
    otp: string;
    password: string;
    email: string;
};
export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { otp, password, email }: ResetPasswordType = await req.json();
        const hashedPassword = await encryptPassword(password);

        const user = await prisma.users.findUnique({
            where: { email: email }
        });

        if (!otp || !password) {
            return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.otp != otp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        await prisma.users.update({
            where: { id: Number(user.id) },
            data: {
                password: hashedPassword,
                otp: '0'
            }
        });

        return NextResponse.json({ success: true, message: 'Password reset successful.' }, { status: 200 });
    } catch (err) {
        console.error('Error in ResetPassword API:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};
