export function getLocalImageUrl(storageUrl) {
  if (!storageUrl) return '';

  try {
    const url = new URL(storageUrl);
    const encodedPath = url.pathname.split('/o/')[1];

    if (!encodedPath) return storageUrl;

    const originalPath = decodeURIComponent(encodedPath);
    const fileName = originalPath.split('/').pop();

    return `${process.env.BASE_URL}images/${encodeURIComponent(fileName)}`;
  } catch (error) {
    console.error('画像URLの変換に失敗:', error);
    return storageUrl;
  }
}