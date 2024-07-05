import { cn } from '@/lib/utils';
import React from 'react';

interface IProps extends React.PropsWithChildren {
  animate?: boolean;
  className?: string;
  fullWidth?: boolean;
  onAnimationEnd?: () => void;
}

const ContentPage = React.forwardRef<HTMLDivElement, IProps>(
  (props: IProps, ref) => {
    const { animate = true, className = '', fullWidth, onAnimationEnd } = props;

    return (
      <div
        ref={ref}
        onAnimationEnd={onAnimationEnd}
        className={cn(
          'h-full p-4 animate-duration-500',
          {
            'animate-fade-up': animate,
            'md:max-w-screen-lg': !fullWidth,
          },
          className
        )}
      >
        {props.children}
      </div>
    );
  }
);

ContentPage.displayName = 'ContentPage';

export { ContentPage };
