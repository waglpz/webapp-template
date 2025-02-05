import t9n from '../../t9n/de.json';

export default {
  textLabels: {
    body: { noMatch: t9n.noData },
    pagination: {
      next: t9n.pagination.next,
      previous: t9n.pagination.previous,
      rowsPerPage: t9n.pagination.rowsPerPage,
      displayRows: t9n.pagination.displayRows,
    },
  },
  selectableRows: 'none',
  download: false,
  filter: false,
  search: false,
  viewColumns: false,
  print: false,
  serverSide: true,
  rowsPerPageOptions: [10, 25, 50],
  sortOrder: {},
  onTableChange: () => {
  },
};
