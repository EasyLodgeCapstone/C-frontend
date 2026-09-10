// Add this at the top of your file, after imports
const uploadToCloudinary = async (file, type) => {
  // Get signature from your Next.js API
  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      folder: type === 'video' ? 'products/videos' : `products/${type}`,
    }),
  });

  if (!signRes.ok) {
    throw new Error('Failed to get upload signature');
  }

  const { signature, timestamp, cloudName, apiKey, folder } = await signRes.json();

  // Build form data
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('api_key', apiKey);
  uploadFormData.append('timestamp', timestamp);
  uploadFormData.append('signature', signature);
  uploadFormData.append('folder', folder);

  // Upload DIRECTLY to Cloudinary
  const resourceType = type === 'video' ? 'video' : 'image';
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: 'POST',
      body: uploadFormData,
    },
  );

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error.error?.message || 'Cloudinary upload failed');
  }

  const data = await uploadRes.json();
  return data.secure_url;
};

export default uploadToCloudinary;