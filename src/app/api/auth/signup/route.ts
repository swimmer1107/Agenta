import { createUser } from '@/lib/db/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        console.log('📝 Signup request received');

        const { email, password, name } = await req.json();

        // Validation
        if (!email || !password || !name) {
            console.log('⚠️ Missing required fields');
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('⚠️ Invalid email format:', email);
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Password validation
        if (password.length < 6) {
            console.log('⚠️ Password too short');
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Name validation
        if (name.trim().length < 2) {
            console.log('⚠️ Name too short');
            return NextResponse.json(
                { error: 'Name must be at least 2 characters' },
                { status: 400 }
            );
        }

        console.log('✅ Validation passed, creating user...');
        const user = await createUser(email, password, name);

        console.log('✅ User created successfully');
        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user._id!.toString(),
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('❌ Signup error:', error);

        if (error.message === 'User already exists') {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        if (error.message && error.message.includes('Database connection failed')) {
            return NextResponse.json(
                { error: 'Database connection error. Please try again later.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create user. Please try again.' },
            { status: 500 }
        );
    }
}
