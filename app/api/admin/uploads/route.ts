import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { saveUploadedImage } from '@/lib/uploads';

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = typeof formData.get('folder') === 'string' ? formData.get('folder') as string : 'divisions';

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Choose an image file to upload.' }, { status: 400 });
    }

    const url = await saveUploadedImage(file, folder);
    return NextResponse.json({ ok: true, url }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
