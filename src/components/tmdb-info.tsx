import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ENV_CONFIG } from '@/constants';
import { getMediaReleaseYear } from '@/lib/formatter';
import { getTmdbImageUrl } from '@/lib/tmdb-image';
import { TMDBData, TMDBMovie, TMDBTv } from '@/types';
import { FilmIcon, StarIcon, TvIcon } from 'lucide-react';
import Image from 'next/image';
import { PropsWithChildren, useState } from 'react';

const DEBUG_BACKDROP = 'https://placehold.co/1280x720?text=backdrop';
const DEBUG_POSTER = 'https://placehold.co/500x750?text=poster';

interface IProps extends PropsWithChildren<any> {
  data: TMDBData;
  onClose?: () => void;
}

export function TmdbInfo(props: IProps) {
  const [open, setOpen] = useState(false);
  const {
    genres,
    media_type,
    overview,
    vote_count,
    vote_average,
    poster_path,
    backdrop_path,
    origin_country,
    content_ratings,
  } = props.data;
  const { name, original_name } = props.data as TMDBTv;
  const { title, original_title } = props.data as TMDBMovie;
  const releaseYear = getMediaReleaseYear(props.data);

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        if (!open) props.onClose?.();
      }}
    >
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent
        className="flex max-h-[80vh] w-[90vw] max-w-[640px] flex-col rounded-sm"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start">
            TMDB Info
          </DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar grid h-[400px] flex-1 gap-4 overflow-auto rounded-lg md:h-auto">
          <AspectRatio ratio={16 / 9}>
            <Image
              fill
              alt="BACKDROP"
              className="rounded-lg object-cover"
              src={
                ENV_CONFIG.DEBUG_MODE
                  ? DEBUG_BACKDROP
                  : getTmdbImageUrl(backdrop_path, 'w1280')
              }
            ></Image>
            <div className="absolute flex h-full w-4/5 flex-col justify-center gap-2 rounded-lg bg-gradient-to-r from-black/80">
              <div className="relative ml-[5%] h-2/3 w-1/3 overflow-hidden rounded-lg shadow-sm backdrop-blur-2xl">
                <Image
                  fill
                  alt="POSTER"
                  className="m-auto !h-[90%] rounded-md object-contain"
                  src={
                    ENV_CONFIG.DEBUG_MODE
                      ? DEBUG_POSTER
                      : getTmdbImageUrl(poster_path)
                  }
                ></Image>
              </div>
              <div className="ml-[5%] hidden space-y-1 md:block">
                <h1 className="text-xl text-white">
                  {name || title} ({releaseYear})
                </h1>
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <span>{original_name || original_title}</span>
                  {origin_country.map(oc => (
                    <span
                      key={oc}
                      className="border border-white/70 px-1 leading-4"
                    >
                      {oc.toUpperCase()}
                    </span>
                  ))}
                  {content_ratings && (
                    <span className="border border-white/70 px-1 leading-4">
                      {content_ratings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </AspectRatio>
          <div className="block space-y-1 md:hidden">
            <h1 className="text-lg">
              {name || title} ({releaseYear})
            </h1>
            <div className="flex items-center space-x-2 text-xs text-foreground/70">
              <span>{original_name || original_title}</span>
              {origin_country.map(oc => (
                <span
                  key={oc}
                  className="border border-foreground/70 px-1 leading-4"
                >
                  {oc.toUpperCase()}
                </span>
              ))}
              {content_ratings && (
                <span className="border border-foreground/70 px-1 leading-4">
                  {content_ratings}
                </span>
              )}
            </div>
            <Separator className="!mt-2"></Separator>
          </div>
          <div className="space-y-1 text-xs md:text-sm">
            <div className="flex h-5 items-center space-x-2">
              <p className="flex items-center gap-1 leading-3">
                <StarIcon
                  size={15}
                  color="orange"
                  className="relative -top-[1px]"
                ></StarIcon>
                {Math.round(vote_average).toFixed(1)} / 10.0 ({vote_count})
              </p>
              <Separator orientation="vertical"></Separator>
              <p className="flex items-center gap-1 leading-3 [&>svg]:relative [&>svg]:-top-[1px]">
                {media_type === 'tv' && <TvIcon size={15}></TvIcon>}
                {media_type === 'movie' && <FilmIcon size={15}></FilmIcon>}
                {genres.join('・')}
              </p>
            </div>
            <Separator className="!mt-2"></Separator>
          </div>
          <div className="space-y-1">
            <h2 className="text-base md:text-lg">Summary</h2>
            <p className="text-xs leading-4 md:text-sm">{overview}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
