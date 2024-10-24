import React, { Fragment } from "react";
import Select from "react-select";

const selectStyle = {
  control: (base, { isDisabled }) => ({
    ...base,
    minHeight: "30px",
    borderRadius: "0.25rem",
    fontSize: "0.8rem !important",
    fontWeight: 400,
    backgroundColor: isDisabled ? "#e9ecef" : undefined,
    border: "1px solid #ced4da",
    color: "#495057",
    paddingLeft: "0.2rem !important",
  }),
  option: (base, { data, isDisabled, isFocused, isSelected }) => ({
    ...base,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: "12px",
    fontWeight: data.fontWeight === undefined || data.fontWeight === null ? 400 : data.fontWeight,
    backgroundColor: isDisabled ? undefined : isSelected ? "#34AEE2" : isFocused ? "rgba(52, 174, 226, 0.1)" : undefined,
    color: isDisabled ? undefined : isSelected ? "#fff" : isFocused ? "#495057" : data.color === undefined || data.color === null ? "#495057" : data.color,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#495057",
  }),
  placeholder: (base) => ({ ...base, color: "#6c757d" }),
  input: (base) => ({ ...base, padding: 0 }),
  dropdownIndicator: (base) => ({ ...base, padding: 3 }),
  menu: (base) => ({ ...base, marginTop: 0 }),
  menuList: (base) => ({ ...base, padding: 3 }),
};

const Select2 = ({ isMulti, options, className, placeholder, optionLabel, optionValue, value, handleChange, required, isDisabled }) => {
  return (
    <Fragment>
      <Select isMulti={isMulti} options={options} className={className} getOptionValue={optionValue} getOptionLabel={optionLabel} placeholder={placeholder} styles={selectStyle} value={value} onChange={handleChange} isDisabled={isDisabled} />
      {value === undefined ||
        ((value === null || value.length === 0) && required !== false && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              width: "100%",
              height: 0,
              position: "absolute",
            }}
            required={required}
          />
        ))}
    </Fragment>
  );
};

export default Select2;
