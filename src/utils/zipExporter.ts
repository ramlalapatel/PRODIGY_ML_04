import JSZip from 'jszip';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Glob all source and configuration files as raw text strings
  const rootFiles = import.meta.glob(
    ['/package.json', '/README.md', '/index.html', '/tsconfig.json', '/vite.config.ts', '/.gitignore', '/metadata.json', '/.github/workflows/*.yml'],
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;

  const srcFiles = import.meta.glob(
    ['/src/**/*.ts', '/src/**/*.tsx', '/src/**/*.css'],
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;

  // Add root files to zip
  for (const [path, content] of Object.entries(rootFiles)) {
    const filename = path.replace(/^\//, '');
    zip.file(filename, content);
  }

  // Add src files to zip
  for (const [path, content] of Object.entries(srcFiles)) {
    const filename = path.replace(/^\//, '');
    zip.file(filename, content);
  }

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'prodigy-task-04-gesture-recognition.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
