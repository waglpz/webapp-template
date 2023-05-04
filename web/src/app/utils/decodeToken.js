export function decodeToken(token) {
  if (!token || typeof token !== 'string' || token.length === 0) {
    return;
  }

  try {
    const parsedJwt = parseJwt(token);
    const dataFromToken = JSON.parse(parsedJwt);

    return dataFromToken;
  } catch (e) {
    console.error('Invalid token');
  }
}

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return jsonPayload;
}
