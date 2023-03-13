import { combineReducers } from 'redux';

import subscription from './subscription/reducer';
import clientSecret from './client-secret/reducer';

export const reducer = combineReducers({
  basket: subscription,
  clientSecret,
});

export default reducer;
