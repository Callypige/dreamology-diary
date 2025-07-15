// app/api/upload/audio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const dreamId = formData.get('dreamId') as string; 
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier audio' }, { status: 400 });
    }

    const userId = session.user.id;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio', userId);

    await mkdir(uploadDir, { recursive: true });
    
    // Create a unique file name using timestamp and dreamId
    const timestamp = Date.now();
    const fileName = `${timestamp}_${dreamId || 'temp'}.webm`;
    const filePath = path.join(uploadDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    const audioUrl = `/uploads/audio/${userId}/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      audioUrl,
      message: 'Audio uploadé avec succès'
    });

  } catch (error) {
    console.error('Erreur upload audio:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors de l\'upload' 
    }, { status: 500 });
  }
}