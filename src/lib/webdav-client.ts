import { WebDAVClientOptions } from '@/types';
import { createClient } from 'webdav';

export function create(options: Omit<WebDAVClientOptions, 'id'>) {
  const { name, remoteURL, ...opts } = options;
  const client = createClient(remoteURL, opts);
  return client;
}

export async function testConnection(options: Omit<WebDAVClientOptions, 'id'>) {
  const client = create(options);
  try {
    await client.stat('/');
    return true;
  } catch {
    return false;
  }
}
