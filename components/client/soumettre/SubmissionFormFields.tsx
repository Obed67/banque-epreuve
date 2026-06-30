import {
  formFieldErrorClass,
  formInputClass,
  formLabelClass,
  formLabelErrorClass,
  formSelectContentClass,
  formSelectItemClass,
  formSelectTriggerClass,
} from '@/lib/form-styles';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

type FieldSelectProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  items: string[];
  onValueChange: (value: string) => void;
  hasError?: boolean;
};

export function FieldSelect({
  id,
  label,
  placeholder,
  value,
  items,
  onValueChange,
  hasError = false,
}: FieldSelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(formLabelClass, hasError && formLabelErrorClass)}
      >
        {label}
      </label>
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={cn(formSelectTriggerClass, hasError && formFieldErrorClass)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={formSelectContentClass}>
          {items.map((item) => (
            <SelectItem key={item} value={item} className={formSelectItemClass}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type FieldInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hasError?: boolean;
};

export function FieldInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
  hasError = false,
}: FieldInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(formLabelClass, hasError && formLabelErrorClass)}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className={cn(
          formInputClass,
          hasError && formFieldErrorClass,
          className,
        )}
      />
    </div>
  );
}
