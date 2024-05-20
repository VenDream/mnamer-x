import { createClient } from 'webdav';

export default function create() {
  return createClient('https://webdav.your-server.com/');
}
