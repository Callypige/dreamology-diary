import connectMongoDB from "@/libs/mongodb";
import Dream from "@/models/Dream";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { title, description } = await request.json();
    await connectMongoDB();
    await Dream.create({ title, description });
    return NextResponse.json({ status: 201, body: { message: "Dream added successfully" } });
}

export async function GET() {
    await connectMongoDB();
    const dreams = await Dream.find();
    return NextResponse.json({ status: 200, body: dreams });
}
export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Topic.findByIdAndDelete(id);
    return NextResponse.json({ status: 200, body: { message: "Dream deleted successfully" } });
}