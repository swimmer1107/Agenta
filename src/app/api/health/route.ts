import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
    try {
        const isConnected = await testConnection();

        if (isConnected) {
            return NextResponse.json({
                status: 'success',
                message: 'Database connection is healthy',
                timestamp: new Date().toISOString(),
            });
        } else {
            return NextResponse.json({
                status: 'error',
                message: 'Database connection failed',
                timestamp: new Date().toISOString(),
            }, { status: 503 });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
