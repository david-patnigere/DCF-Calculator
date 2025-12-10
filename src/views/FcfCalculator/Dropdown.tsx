import { MenuItem, Select } from "@mui/material";
import { FC, useState } from "react";

type DropdownType = {
  label: string;
  value: string | number;
  options: (string | number)[];
  onChange: (newValue: string | number) => void;
};

const Dropdown: FC<DropdownType> = ({ label, value, options, onChange }) => {
  const handleChange = (evt) => {
    onChange(evt.target.value);
  };

  const dropdownOptions = options.map((option) => {
    return <MenuItem value={option}>{option}</MenuItem>;
  });

  return (
    <>
      <Select
        id="dropdown-selector"
        label={label}
        value={value}
        onChange={handleChange}
        style={{ marginRight: "10px" }}
      >
        {dropdownOptions}
      </Select>
    </>
  );
};

export default Dropdown;
