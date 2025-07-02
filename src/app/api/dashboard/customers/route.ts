import prisma from '@/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const body = await req.json();

        const customer = await prisma.customers.findFirst({
            where: {
                user_id: Number(userId),
                email: body.mobile
            }
        });

        if (body.name == '' || body.mobile == '') {
            return NextResponse.json({ message: 'Customer name and mobile is required' }, { status: 400 });
        }
        if (customer) {
            return NextResponse.json({ message: 'Customer already exists' }, { status: 400 });
        }

        const data = await prisma.customers.create({
            data: {
                name: body.name,
                email: body.email,
                mobile: body.mobile,
                user_id: Number(userId)
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true
            }
        });
        return NextResponse.json({ message: 'Customers added successfully', success: true, data }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const body = await req.json();

        const customer = await prisma.customers.update({
            where: {
                id: Number(body.id),
                user_id: Number(userId)
            },
            data: {
                name: body.name,
                email: body.email || '',
                mobile: body.mobile
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true
            }
        });
        return NextResponse.json(
            {
                message: 'Customer updated successfully',
                success: true,
                data: customer
            },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }
        const customers = await prisma.customers.findMany({
            where: {
                user_id: Number(userId)
            },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        return NextResponse.json(
            {
                message: 'Customer fetched successfully',
                success: true,
                data: customers
            },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }
        const body = await req.json();
        // const invoices = await prisma.invoices.findMany({
        //     where: {
        //         customer_id: Number(body.id),
        //         user_id: Number(userId)
        //     },
        //     select: {
        //         id: true
        //     }
        // });

        //const invoiceIds = invoices.map((inv) => inv.id);

        // 2. Delete all related invoice_products
        // await prisma.invoice_products.deleteMany({
        //     where: {
        //         invoice_id: { in: invoiceIds }
        //     }
        // });

        // 3. Delete all invoices of this customer
        // await prisma.invoices.deleteMany({
        //     where: {
        //         id: { in: invoiceIds },
        //         user_id: Number(userId)
        //     }
        // });

        // 4. Delete the customer
        await prisma.customers.delete({
            where: {
                id: Number(body.id),
                user_id: Number(userId)
            }
        });

        return NextResponse.json({ message: 'Customer deleted', success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};
