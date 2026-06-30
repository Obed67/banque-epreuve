import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#0077d2]',
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
      <input
        type="text"
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
}
