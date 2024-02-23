export const formatBytes = (bytes: number, withFormats = true) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (withFormats) return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) as number;
};
