import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

/** @see https://developer.themoviedb.org/docs/faq#what-are-the-attribution-requirements */
const TMDB_LOGO =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg';
const TMDB_LOGO_RATIO = 150 / 11;

export default function Credits() {
  return (
    <div className="p-4 md:max-w-screen-lg">
      <h1 className="mb-4 text-xl">Credits</h1>
      <Card className="rounded">
        <CardHeader>
          <CardTitle>TMDB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="md:w-80">
            <AspectRatio ratio={TMDB_LOGO_RATIO} className="relative">
              <Image
                fill
                alt="TMDB_LOGO"
                className="object-cover"
                src={TMDB_LOGO}
              ></Image>
            </AspectRatio>
          </div>
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
