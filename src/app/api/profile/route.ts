import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions) as { user?: { id?: string; name?: string; email?: string } } | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const Profile = (await import("@/models/Profile")).default;

  let profile = await Profile.findOne({ user: session.user.id });

  // If no profile exists, create a new one
  if (!profile) {
    profile = await Profile.create({
      user: session.user.id,
      name: session.user.name || "Nouvel utilisateur",
      email: session.user.email,
      bio: "",
      location: "",
      avatarUrl: ""
    });
  }

  return NextResponse.json(profile, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions) as { user?: { id?: string; name?: string; email?: string } } | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const Profile = (await import("@/models/Profile")).default;

  const { name, bio, location, avatarUrl } = await request.json();

  const profile = await Profile.findOneAndUpdate(
    { user: session.user.id },
    { name, bio, location, avatarUrl },
    { new: true }
  );

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile, { status: 200 });
}
