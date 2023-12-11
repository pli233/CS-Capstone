// RouterContext.js
import { createContext } from 'react';

const RouterContext = createContext({
  router: '',
  setRouter: () => {},
});

export default RouterContext;
