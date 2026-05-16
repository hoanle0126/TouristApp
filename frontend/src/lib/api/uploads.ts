const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = 'Failed to upload image';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(message);
  }

  const data = await response.json();
  
  // The backend returns a relative URL like /uploads/...
  // We need to return the absolute URL so the frontend can display it correctly.
  return {
    url: `${API_URL}${data.url}`,
  };
}
