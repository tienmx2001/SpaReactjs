import PropTypes from "prop-types";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

import MKInput from "components/MKInput";

function MKDatePicker({ input, label, value, onChange, ...rest }) {
  return (
    <Flatpickr
      {...rest}
      value={value}
      onChange={onChange}
      render={({ defaultValue }, ref) => (
        <MKInput
          {...input}
          value={value}
          defaultValue={defaultValue}
          fullWidth
          variant="standard"
          inputRef={ref}
          label={label}
          InputLabelProps={{
            shrink: value || defaultValue ? true : false,
          }}
        />
      )}
    />
  );
}

MKDatePicker.defaultProps = {
  input: {},
  label: "",
  value: "",
  onChange: () => {}, // thêm mặc định an toàn
};

MKDatePicker.propTypes = {
  input: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.any])),
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default MKDatePicker;
