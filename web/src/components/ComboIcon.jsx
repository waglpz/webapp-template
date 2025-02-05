import { PropTypes } from 'prop-types';

export const smStyle = ({
                          ml,
                          mt,
                          fontSize,
                        }) => {
  return {
    ml: (ml ?? -0.65),
    mt: (mt ?? -2.75),
    fontSize: (fontSize ?? 11),
  };
};

export const ComboIcon = ({ children }) => {
  return <span
    style={{
      display: 'inline-flex',
      flexDirection: 'row',
      justifyContent: 'Center',
      alignItems: 'Center',
    }}
  >{children}</span>;
};

ComboIcon.propTypes = { children: PropTypes.array.isRequired };
