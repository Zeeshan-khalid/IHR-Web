/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');

module.exports = () => {
 
  const initialConfig = {
    reactStrictMode: true,
    env: {
      API_KEY: process.env.API_KEY,
      FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
      SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
      IHR_BASE_URL: process.env.IHR_BASE_URL
    },
    images: {
      domains: [
        'stage-ihr-line-items-images.s3.amazonaws.com',
        'ihr-line-items-images.s3.amazonaws.com',
        'picsum.photos',
        'lh3.googleusercontent.com',
        'firebasestorage.googleapis.com',
        'i5.walmartimages.com',
        'kroger.com',
        'www.kroger.com',
        'dsom-imager-prod.shipt.com',
        'd1ralsognjng37.cloudfront.net',
        'images.costcobusinessdelivery.com',
        'assets.petco.com',
        'images-na.ssl-images-amazon.com',
        'static.meijer.com',
        'scene7.targetimg1.com',
        'ct.mywebgrocer.com',
        'static.meijer.com',
        'flagcdn.com',
        'upload.wikimedia.org'
      ],
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `https://api.staging.receiptserver.com/api/:path*`, // Proxy to Backend
        },
      ];
    },
  };
  return withLess({
    ...initialConfig,
  });
};
