import {
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon,
} from 'lucide-react';
import { FileStat } from 'webdav';

const ARCHIVE_FILES = [
  '.zip',
  '.7z',
  '.rar',
  '.tar',
  '.gz',
  '.bz2',
  '.xz',
  '.var',
];

export function getStatItemIcon(stat: FileStat) {
  const { type, mime, basename } = stat;
  let Icon = type === 'directory' ? FolderIcon : FileIcon;

  if (mime?.includes('image')) Icon = FileImageIcon;
  if (mime?.includes('video')) Icon = FileVideoIcon;
  if (mime?.includes('audio')) Icon = FileAudioIcon;
  if (basename.endsWith('.txt')) Icon = FileTextIcon;
  if (ARCHIVE_FILES.some(format => basename.toLowerCase().endsWith(format)))
    Icon = FileArchiveIcon;

  return Icon;
}
