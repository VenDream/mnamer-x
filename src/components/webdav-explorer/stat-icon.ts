import { ARCHIVE_FILES } from '@/constants/file-types';
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
