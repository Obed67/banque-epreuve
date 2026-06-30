'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formInputClass, formLabelClass } from '@/lib/form-styles';
import { cn } from '@/lib/utils';

type FormPasswordFieldProps = {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function FormPasswordField({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = '••••••••',
}: FormPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={formLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name ?? id}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
          placeholder={placeholder}
          className={cn(formInputClass, 'pr-12')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 cursor-pointer disabled:opacity-50"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
