export function nameToAbbreviation(name) {
  const w = name.split(' ');
  if (w.length === 1) {
    return w[ 0 ].length > 1 ? `${w[ 0 ][ 0 ]}${w[ 0 ][ 1 ]}`.toUpperCase() : `${w[ 0 ][ 0 ]}`.toUpperCase();
  }

  if (w.length > 1) {
    if (w[ 0 ].length === 2 && w[ 0 ][ 0 ].toUpperCase() === w[ 0 ][ 0 ] && w[ 0 ][ 1 ].toUpperCase() === w[ 0 ][ 1 ]) {
      return w[ 0 ];
    }
    if (w[ 1 ][ 0 ] === '(') {
      return w[ 0 ][ 0 ];
    }
    return `${w[ 0 ][ 0 ]}${w[ 1 ][ 0 ]}`.toUpperCase();
  }
  return name;
}

export function mergeExistingProps(obj1, obj2) {
  return Object.keys(obj1).reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      acc[ key ] = obj2[ key ];
    } else {
      acc[ key ] = obj1[ key ];
    }
    return acc;
  }, {});
}

export const userRoleLabel = (miscData, currentUserRoles) => {
  const currentRoles = miscData.rolesList.filter(
    (role) => {
      return currentUserRoles.filter(
        (curRole) => {
          return role.value === curRole;
        },
      ).length > 0;
    },
  );

  return currentRoles.length > 0 ? currentRoles[ 0 ].label : 'unknown role';
};

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(11)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const options2HttpQuery = (options) => {
  const queryOptions = new URLSearchParams();
  Object.keys(options).forEach((key) => {
    if (options[ key ]) {
      queryOptions.append(key, options[ key ]);
    }
  });

  return `?${queryOptions.toString()}`;
};

export function intToHumanReadableSizes(bytes, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[ i ]}`;
}

export function intToReadableDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} Std `);
  }
  if (minutes > 0) {
    parts.push(`${minutes} Min `);
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} Sek`);
  }

  return parts.join('');
}
