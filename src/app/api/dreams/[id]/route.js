import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream";
import { NextResponse } from "next/server";


export async function PUT(request, { params }) {
    const { id } = params;
    const { newTitle: title, newDescription: description } = await request.json();
    await connectMongoDB();
    await Dream.findByIdAndUpdate(id, { title, description });
    return NextResponse.json({ status: 200, body: { message: "Dream updated successfully" } });
}

export async function GET(request, { params }) {
    // Get session user connected
    const session = await getServerSession(authOptions);

    if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params
    await connectMongoDB();
    const dream = await Dream.findOne({ _id: id,  user: session.user.id });

    if (!dream) {
        return NextResponse.json({ error: "Dream not found or access denied" }, { status: 404 });
      }
      
    return NextResponse.json({ dream }, { status: 200 });
  }