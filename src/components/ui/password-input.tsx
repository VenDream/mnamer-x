import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

type PasswordInputProps = InputProps;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props: PasswordInputProps, ref) => {
    const [showPwd, setShowPwd] = useState(false);
    const Icon = showPwd ? EyeOffIcon : EyeIcon;

    return (
      <div className="relative">
        <Input
          type={showPwd ? 'text' : 'password'}
          className={cn(props.className, 'pr-10')}
          ref={ref}
          {...props}
        />
        <Button
          variant="ghost"
          title={showPwd ? 'Hide password' : 'Show password'}
          onClick={evt => {
            evt.preventDefault();
            setShowPwd(!showPwd);
          }}
          className={cn(
            'absolute right-2 top-1/2 flex h-6 w-6',
            '-translate-y-1/2 items-center justify-center p-0'
          )}
        >
          <Icon size={16} />
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
