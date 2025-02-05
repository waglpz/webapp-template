import {
  useMemo,
  useState,
} from 'react';

import defaultMuiDataTableOptions from '../utils/defaultMuiDataTableOptions';

export const useTableOptions = (initialRequestOptions = {}) => {
  const [requestOptions, setRequestOptions] = useState(initialRequestOptions);

  const initialTableOptions = useMemo(() => {
    return {
      ...defaultMuiDataTableOptions,
      // rowsPerPageOptions: [5, 10, 50],
      onTableChange: (action, state) => {
        let newOptions;
        switch (action) {
          case 'changePage':
            newOptions = {
              ...requestOptions,
              page: (state.page + 1),
            };
            setRequestOptions(newOptions);
            break;
          case 'changeRowsPerPage':
            newOptions = {
              ...requestOptions,
              limit: state.rowsPerPage,
              page: (state.page + 1),
            };
            setRequestOptions(newOptions);
            break;
          case 'sort':
            newOptions = {
              ...requestOptions,
              ...initialRequestOptions,
            };
            if (state.sortOrder) {
              const propertyName = `sort[${state.sortOrder.name}]`;
              newOptions[ propertyName ] = state.sortOrder.direction;
            }
            setRequestOptions(newOptions);
            break;
          default:
            // handle other actions or do nothing
            break;
        }
      },
    };
  }, [requestOptions]);

  return { initialTableOptions, requestOptions, setRequestOptions };
};
