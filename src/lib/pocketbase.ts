import PocketBase from 'pocketbase';

// Use environment variable for URL
const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';

// Client for public logic (if any)
export const pb = new PocketBase(pbUrl);

// Factory for Admin Client (Server-Side) to avoid shared state
export async function getAdminClient() {
    const adminPb = new PocketBase(pbUrl);
    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('PocketBase Admin credentials not set in environment variables');
    }

    try {
        await adminPb.admins.authWithPassword(email, password);
    } catch (error) {
        console.error("Failed to authenticate PocketBase admin:", error);
        throw error;
    }

    return adminPb;
}
