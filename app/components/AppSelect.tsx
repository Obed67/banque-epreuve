'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formFilterLabelClass,
  formLabelClass,
  formSelectContentClass,
  formSelectItemClass,
  formSelectTriggerClass,
} from '@/lib/form-styles';
import { cn } from '@/lib/utils';

export type AppSelectOption = {
  value: string;
  label: string;
};

type AppSelectProps = {
  id?: string;
  label?: string;
  labelVariant?: 'default' | 'filter';
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
};

export default function AppSelect({
  id,
  label,
  labelVariant = 'default',
  placeholder = 'Sélectionner',
  value,
  onValueChange,
  options,
  disabled = false,
  className,
  triggerClassName,
}: AppSelectProps) {
  const labelClass = labelVariant === 'filter' ? formFilterLabelClass : formLabelClass;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(formSelectTriggerClass, triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={formSelectContentClass}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={formSelectItemClass}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
