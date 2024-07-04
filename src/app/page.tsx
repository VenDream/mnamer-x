import { UnderlineLink } from '@/components/link';
import { ContentPage } from '@/components/ui/content-page';

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
    <ContentPage>
      <h1 className="mb-4 text-xl">Introduction</h1>
      <div className="[&>p]:mt-2 [&>p]:text-sm [&>p]:text-muted-foreground">
        <p>
          <span className="font-bold">mnamer-x</span> leverages LLMs to name
          your media files to be scrapers-friendly.
        </p>
        <p className="mt-2">Including:</p>
        <ul className="ml-6 list-disc text-sm text-muted-foreground">
          {SUPPORTED_SCRAPERS.map(scraper => (
            <li key={scraper.name} className="mt-2">
              <UnderlineLink href={scraper.site} target="_blank">
                {scraper.name}
              </UnderlineLink>
            </li>
          ))}
          <li className="mt-2">And more...</li>
        </ul>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Start your first
        <UnderlineLink href="/tasks" className="mx-1">
          task
        </UnderlineLink>
        now.
      </p>
    </ContentPage>
  );
}
