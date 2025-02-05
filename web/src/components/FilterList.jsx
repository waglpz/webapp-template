import { Clear }     from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  TextField,
}                    from '@mui/material';
import { PropTypes } from 'prop-types';

import { DatePickerWrapper } from './';

export const debounceTime = 400;

let timeoutInProgress;

export const transformFilterOptions = (filter) => {
  const o = {};
  Object.keys(filter).forEach((name) => {
    return o[ 'filter[' + name + ']' ] = (filter[ name ] || undefined);
  });

  return o;
};

const handleFilterChanged = (filter, filterState, onFilterChanged) => {
  if (timeoutInProgress) {
    clearTimeout(timeoutInProgress);
  }
  timeoutInProgress = setTimeout(() => {
    const updatedFilter = transformFilterOptions({ ...filterState, ...filter });
    onFilterChanged(updatedFilter);
  }, debounceTime);
};

export const onChangeField = (name, event, filterState, onFilterChanged, onChange) => {
  onChange({ ...filterState, [ name ]: event.target.value });
  handleFilterChanged({ [ name ]: event.target.value }, filterState, onFilterChanged);
};

export const onChangeDateTimeField = (name, date, filterState, onFilterChanged, onChange) => {
  const newFilterValue = {};
  newFilterValue[ name ] = date;

  onChange({ ...filterState, ...newFilterValue });
  handleFilterChanged(newFilterValue, filterState, onFilterChanged);
};

export const clearFilters = (onFilterChanged) => {
  if (timeoutInProgress) {
    clearTimeout(timeoutInProgress);
  }
  onFilterChanged(transformFilterOptions({}));
};

const FilterBox = ({ children }) => {
  return <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      p: 0,
      m: 0,
      mb: 1,
      bgcolor: 'background.transparent',
    }}
  >{children}</Box>;
};

FilterBox.propTypes = { children: PropTypes.node.isRequired };

export const Field = ({
                        name,
                        label,
                        value,
                        onChange,
                      }) => {
  return <TextField
    sx={{
      ml: 0,
      mr: 1,
    }}
    name={name}
    id={`filter${name}`}
    label={label}
    value={value[ name ] ?? ''}
    onChange={(event) => {
      return onChange(name, event);
    }}
  />;
};

Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const Select = ({
                         name,
                         label,
                         value,
                         onChange,
                         children,
                       }) => {
  return <FormControl fullWidth>
    <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
    <MuiSelect
      name={name}
      sx={{ ml: 0 }}
      labelId={`${name}-select-label`}
      id={`${name}-select`}
      label={label}
      value={value[ name ] ?? ''}
      onChange={(event) => {
        onChange(name, event);
      }}
    >
      {children}
    </MuiSelect>
  </FormControl>;
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const DateTimeField = ({
                                name,
                                label,
                                value,
                                onChange,
                              }) => {
  return <DatePickerWrapper
    style={{
      // display: 'inline-block',
      width: '100%',
      // verticalAlign: 'top',gh
      marginLeft: -8,
      marginRight: 16,
    }}
    label={label}
    value={value[ name ] ?? ''}
    onChange={(event) => {
      return onChange(name, event);
    }}
    availableDates={[]}
  />;
};

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const FilterList = ({
                             children,
                             onClearFilters,
                           }) => {

  return (
    <>
      <form>
        <FilterBox>
          {children}
          <Button
            variant="text"
            style={{
              height: '24px',
              marginTop: 16,
            }}
            title="Filter zurücksetzen"
            onClick={onClearFilters}
          >
            <Clear />
          </Button>
        </FilterBox>
      </form>
    </>
  );
};

FilterList.propTypes = {
  onClearFilters: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
