
const __gotoStartpage = 'Zur Startpage';

const __notFoundPage = {
  route: {
    pageNotFound: '/seite-nicht-gefunden',
  },
  page: {
    label: {
      title: '404 Page not found',
      subtitle: 'Die von Ihnen angegeben Seite wurde nicht gefunden.',
    }
  },
};
const __forbidden = {
  route: {
    forbidden: '/zugriff-nicht-erlaubt',
  },
  page: {
    label: {
      title: '403 Access forbidden',
      subtitle: 'Sie sind vom Admin temporär deaktiviert worden sind.',
    }
  },
};

const __unauthorized = {
  route: {
    unauthorized: '/nicht-autorisiert',
  },
  page: {
    label: {
      title: '401 Unauthorized',
      subtitle: 'Sie sind vom Admin nicht autorisiert worden.',
    }
  },
};

export { __notFoundPage, __forbidden, __unauthorized, __gotoStartpage };
