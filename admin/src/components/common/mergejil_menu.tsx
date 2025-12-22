import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export type ItemValue = {
  value: string;
  label: string;
};

type SelectMenuProps = {
  items: ItemValue[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
};

const SelectMenu: React.FC<SelectMenuProps> = ({
  items,
  placeholder,
  onValueChange,
  defaultValue,
  disabled,
}) => {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Сонгоно уу..."} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMenu;
