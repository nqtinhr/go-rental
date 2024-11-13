const NodeGeocoder = require("node-geocoder");

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  fetch: async (url: string, options: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'Gorenal/1.0 (itnetwork102@gmail.com)',
        ...options.headers,
      },
    });
  }
};

const geocoder = NodeGeocoder(options);

export default geocoder;
