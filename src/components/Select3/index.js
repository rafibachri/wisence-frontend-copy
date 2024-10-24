import React, { Fragment } from "react";
import Select from "react-select";

const selectStyle = {
  control: (base, { isDisabled }) => ({
    ...base,
    minHeight: "25px",
    minWidth: "120px",
    borderRadius: "0.25rem",
    fontSize: "0.8rem !important",
    fontWeight: 400,
    backgroundColor: isDisabled ? "#e9ecef" : "#ffffff",
    border: "1px solid #328cb4",
    color: "#328cb4",
    paddingLeft: "0.2rem !important",
    "&:hover": {
      borderColor: "#328cb4",
      boxShadow: "0 5px 10px rgba(115, 108, 199, 0.4) !important",
    },
  }),
  indicatorSeparator: (base, { isDisabled }) => ({
    ...base,
    backgroundColor: isDisabled ? "#e9ecef" : "#328cb4",
  }),
  option: (base, { isDisabled, isFocused, isSelected }) => ({
    ...base,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: "12px",
    fontWeight: 400,
    backgroundColor: isDisabled ? undefined : isSelected ? "#34AEE2" : isFocused ? "rgba(52, 174, 226, 0.1)" : undefined,
    color: isDisabled ? undefined : isSelected ? "#fff" : isFocused ? "#495057" : "#495057",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#328cb4",
  }),
  placeholder: (base) => ({ ...base, color: "#328cb4" }),
  input: (base) => ({ ...base, padding: 0 }),
  dropdownIndicator: (base) => ({ ...base, padding: 3, color: "#328cb4 !important" }),
  menu: (base) => ({ ...base, marginTop: 0 }),
  menuList: (base) => ({ ...base, padding: 3 }),
};

const Select3 = ({ options, className, placeholder, optionLabel, optionValue, value, handleChange, required, isDisabled }) => {
  return (
    <Fragment>
      <Select options={options} className={className} getOptionValue={optionValue} getOptionLabel={optionLabel} placeholder={placeholder} styles={selectStyle} value={value} onChange={handleChange} isDisabled={isDisabled} />
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

export default Select3;
