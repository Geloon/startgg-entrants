import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const getClient = () => {
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) {
        throw new Error('REDIS_URL is not defined');
    }
    return new Redis(connectionString);
};

export async function GET() {
    try {
        const redis = getClient();
        const downloads = await redis.get('total_downloads');
        redis.quit(); // Close connection to prevent leaks in serverless/lambdas if reusing isn't handled by framework
        return NextResponse.json({ downloads: downloads ? parseInt(downloads) : 0 });
    } catch (error) {
        console.error('Error fetching stats:', error);
        // Return 0 if Redis fails, gracefully degrade
        return NextResponse.json({ downloads: 0 });
    }
}

export async function POST() {
    try {
        const redis = getClient();
        const newCount = await redis.incr('total_downloads');
        redis.quit();
        return NextResponse.json({ downloads: newCount });
    } catch (error) {
        console.error('Error updating stats:', error);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}
