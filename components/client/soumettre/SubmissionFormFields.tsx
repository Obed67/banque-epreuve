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
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
};

export function FieldInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
  hasError = false,
  type = "text",
  required = true,
  autoComplete,
  hint,
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
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          formInputClass,
          hasError && formFieldErrorClass,
          className,
        )}
      />
      {hint && !hasError && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

type FieldCheckboxProps = {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function FieldCheckbox({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
}: FieldCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3 transition-colors hover:bg-gray-50"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#0077d2] focus:ring-[#0077d2]"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#0f172a]">{label}</span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
    </label>
  );
}
