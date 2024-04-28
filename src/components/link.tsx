import Link from 'next/link';

type LinkProps = Parameters<typeof Link>[0];

export function UnderlineLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className="underline underline-offset-2 hover:text-blue-500"
    ></Link>
  );
}
