import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const Profile = (await import("@/models/profile")).default;

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

export async function PATCH(request: { json: () => any }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  const Profile = (await import("@/models/profile")).default;

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
