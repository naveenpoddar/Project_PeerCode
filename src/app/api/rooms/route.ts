import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Room from '@/models/Room';

// ─── GET /api/rooms ───────────────────────────────────────────────────────────
// Returns all rooms in JSON, newest first.

export async function GET() {
  try {
    await connectDB();

    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .select('roomId title createdBy createdAt')
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: rooms.length,
        rooms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/rooms]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// ─── POST /api/rooms ──────────────────────────────────────────────────────────
// Creates a new room entry in MongoDB.
// Body: { roomId, title, createdBy }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, title, createdBy } = body as {
      roomId?: string;
      title?: string;
      createdBy?: string;
    };

    // Validate required fields
    if (!roomId || !title || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'roomId, title, and createdBy are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert — if room already exists (e.g. rejoining), just return it
    const room = await Room.findOneAndUpdate(
      { roomId: roomId.toUpperCase() },
      { roomId: roomId.toUpperCase(), title: title.trim(), createdBy: createdBy.trim() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      { success: true, room },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/rooms]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
