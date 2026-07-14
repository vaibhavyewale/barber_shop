import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App.tsx';

try {
  console.log("Rendering...");
  const html = renderToString(<StaticRouter location="/contact"><App /></StaticRouter>);
  console.log("Success!");
} catch (e) {
  console.error("Error rendering:", e);
}
