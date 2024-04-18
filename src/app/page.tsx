import Link from '@/components/link';

interface Scraper {
  name: string;
  site: string;
}

const SUPPORTED_SCRAPERS: Scraper[] = [
  {
    name: 'Infuse',
    site: 'https://firecore.com/infuse',
  },
  {
    name: 'Plex',
    site: 'https://www.plex.tv',
  },
  {
    name: 'Emby',
    site: 'https://emby.media',
  },
  {
    name: 'VidHub',
    site: 'https://zh.okaapps.com/product/1659622164',
  },
];

export default function Home() {
  return (
    <div className="h-full w-full p-4">
      <h1 className="text-3xl">Introduction</h1>
      <div className="[&>p]:mt-2 [&>p]:text-sm [&>p]:text-muted-foreground">
        <p>
          <span className="font-bold">mnamer-x</span> leverages LLMs to name
          your media files to be scraper-friendly.
        </p>
        <p className="mt-2">Including:</p>
        <ul className="ml-6 list-disc text-sm text-muted-foreground">
          {SUPPORTED_SCRAPERS.map(scraper => (
            <li
              key={scraper.name}
              className="mt-2 underline underline-offset-2"
            >
              <Link href={scraper.site} target="_blank">
                {scraper.name}
              </Link>
            </li>
          ))}
          <li className="mt-2">And more...</li>
        </ul>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Start your first <Link href="/tasks">task</Link> now.
      </p>
    </div>
  );
}
