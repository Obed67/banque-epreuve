import { formInputClass, formLabelClass } from '@/lib/form-styles';
import { cn } from '@/lib/utils';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export default function FormInput({
  label,
  id,
  className,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className={formLabelClass}>
        {label}
      </label>
      <input
        id={id}
        className={cn(formInputClass, className)}
        {...props}
      />
    </div>
  );
}
