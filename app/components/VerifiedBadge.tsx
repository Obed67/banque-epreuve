import { BadgeCheck } from 'lucide-react';
import Badge from './Badge';
import { cn } from '@/lib/utils';

type VerifiedBadgeProps = {
  className?: string;
};

export default function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <Badge
      variant="success-subtle"
      className={cn('inline-flex items-center gap-1 shrink-0', className)}
    >
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
      Vérifié
    </Badge>
  );
}
