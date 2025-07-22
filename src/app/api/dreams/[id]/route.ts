import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  return isNaN(date.valueOf()) ? undefined : date;
}

// 📝 PUT - Update a specific dream
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // ← Await les params
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  console.log('🔍 PUT Received ID:', id); // Debug

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Invalid dream ID" }, { status: 400 });
  }

  await connectMongoDB();

  const updateData = {
    ...body,
    sleepTime: body.sleepTime ? parseDate(body.sleepTime) : undefined,
    wokeUpTime: body.wokeUpTime ? parseDate(body.wokeUpTime) : undefined,
  };

  const updated = await Dream.findOneAndUpdate(
    { _id: id, user: session.user.id },
    updateData,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Dream not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ message: "Dream updated successfully", dream: updated }, { status: 200 });
}

// 📥 GET - Retrieve a specific dream
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params; // ← Await les params
  const { id } = params;

  console.log('🔍 Received ID:', id); // Debug

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Invalid dream ID" }, { status: 400 });
  }

  await connectMongoDB();

  const dream = await Dream.findOne({ _id: id, user: session.user.id });

  if (!dream) {
    return NextResponse.json({ error: "Dream not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ dream }, { status: 200 });
}