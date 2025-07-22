import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function toDateFromHHMM(hhmm: string | undefined) {
  if (!hhmm) return undefined;
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();                     
  d.setHours(h, m, 0, 0);
  return d;
}

export async function POST(request: { json: () => any; }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();

  await connectMongoDB();
  await Dream.create({ ...body,sleepTime : toDateFromHHMM(body.sleepTime),
    wokeUpTime: toDateFromHHMM(body.wokeUpTime), user: userId });

  return NextResponse.json(
    { message: "Dream added successfully" },
    { status: 201 }
  );
}

export async function GET(request: { url: string; }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  // Extracting query parameters from the request URL
  const type = searchParams.get("type"); // string: "lucid,nightmare,normal"
  const mood = searchParams.get("mood"); // string: "happy,sad,angry"
  const tag = searchParams.get("tag"); // string: "tag1,tag2,tag3"
  const recurring = searchParams.get("recurring"); // string: "true"/"false"
  const dreamScore = searchParams.get("dreamScore"); // stringified number
  const hasAudio = searchParams.get("hasAudio"); // string: "true"/"false"
  const date = searchParams.get("date"); // string: "YYYY-MM-DD"
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  await connectMongoDB();

  const filters: any = { user: session.user.id }; 

  // Build filters based on query parameters
  if (type) filters.type = type;
  if (tag) filters.tags = { $in: [tag] };
  if (mood) filters.mood = mood;
  if (recurring) filters.recurring = recurring === "true";
  if (dreamScore && Number(dreamScore) > 0) filters.dreamScore = { $gte: Number(dreamScore) };
  if (hasAudio === 'true') {
      filters.audioNote = { $exists: true, $ne: "" };
  }
  if (date) {
    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');
    filters.date = { $gte: start, $lte: end };
  } else if (startDate && endDate) {
    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T23:59:59.999Z');
    filters.date = { $gte: start, $lte: end };
}

  // Count total dreams for pagination
  const totalDreams = await Dream.countDocuments(filters);
  const totalPages = Math.ceil(totalDreams / limit);

  // Get dreams with pagination
  const dreams = await Dream.find(filters)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); 

    // Pagination metadata
  const pagination = {
    currentPage: page,
    totalPages: totalPages,
    totalDreams: totalDreams,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    limit: limit,
  };

  return NextResponse.json({ body: dreams, pagination }, { status: 200 });
}

export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");

  await connectMongoDB();
  await Dream.findOneAndDelete({ _id: id, user: session.user.id });

  return NextResponse.json(
    { message: "Dream deleted successfully" },
    { status: 200 }
  );
}
