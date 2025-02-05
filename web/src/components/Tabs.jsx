import {
  Tabs as MuiTabs,
  Tab,
  Box,
}                   from '@mui/material';
import PropTypes    from 'prop-types';
import { useState } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tab-panel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function Tabs({ tabs }) {
  const [value, setValue] = useState(0);

  const onChange = (event, change) => {
    setValue(change);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={value}

                 onChange={onChange}
                 aria-label="tabs">
          {tabs.map((tab, index) => {
            return <Tab key={`tab-${index}`}
                        label={tab.label}
                        id={`tab-${index}`}
                        aria-controls={`tab-panel-${index}`}/>;
          })}
        </MuiTabs>
      </Box>
      {tabs.map((tab, index) => {
        return <TabPanel
          key={`tab-panel-${index}`}
          value={value}
          index={index}>
          <>{tab.tabPanel}</>
        </TabPanel>;
      })}
    </Box>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    tabPanel: PropTypes.node.isRequired,
  })).isRequired,
};