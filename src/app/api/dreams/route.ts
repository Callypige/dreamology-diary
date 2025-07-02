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

  // Extracting query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // string: "lucid,nightmare,normal"
  const mood = searchParams.get("mood"); // string: "happy,sad,angry"
  const tag = searchParams.get("tag"); // string: "tag1,tag2,tag3"
  const recurring = searchParams.get("recurring"); // string: "true"/"false"
  const dreamScore = searchParams.get("dreamScore"); // stringified number

  await connectMongoDB();

  const filters: any = { user: session.user.id };

  if (type) filters.type = type;
  if (tag) filters.tags = { $in: [tag] };
  if (mood) filters.mood = mood;
  if (recurring !== null) filters.recurring = recurring === "true";
  if (dreamScore !== null) filters.dreamScore = { $gte: Number(dreamScore) };


  const dreams = await Dream.find(filters).sort({ createdAt: -1 });

  return NextResponse.json({ body: dreams }, { status: 200 });
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
