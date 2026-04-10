import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type FieldSelectProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  items: string[];
  onValueChange: (value: string) => void;
};

export function FieldSelect({
  id,
  label,
  placeholder,
  value,
  items,
  onValueChange,
}: FieldSelectProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-sm text-gray-700">
        {label}
      </Label>
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="w-full rounded-lg border-gray-300 focus:ring-[#0077d2]"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
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
};

export function FieldInput({
  id,
  label,
  value,
  placeholder,
  onChange,
}: FieldInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-sm text-gray-700">
        {label}
      </Label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
      />
    </div>
  );
}
