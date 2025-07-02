import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        //delete the user session cookie
        const cookieStore = await cookies();
        cookieStore.delete('token');

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        console.error('Error during logout:', err);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
};
