import prisma from '@/config/prisma';
import { encryptPassword } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface UserBody {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    password: string;
    otp: string;
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: UserBody = await req.json();
        if (!body.first_name || !body.last_name || !body.mobile || !body.email || !body.password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        console.log('body', body);
        const existingUser = await prisma.users.findUnique({
            where: {
                email: body.email
            }
        });
        if (existingUser?.email) {
            return NextResponse.json({ message: 'User already exists', success: false }, { status: 400 });
        }

        const hashedPassword = await encryptPassword(body.password);

        const user = await prisma.users.create({
            data: {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
                mobile: body.mobile,
                password: hashedPassword,
                otp: '0'
            }
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                success: true,
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile
                }
            },
            { status: 200 }
        );
    } catch (err: unknown) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal Server Error'
            },
            { status: 500 }
        );
    }
};

// export const GET = async (req: NextRequest): Promise<NextResponse> => {};
