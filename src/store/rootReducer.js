import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import page from './page/reducer';
import sites from './sites/reducer';
import articles from './articles/reducer';
import user from './user/reducer';

export default combineReducers({
  form: formReducer,
  page,
  sites,
  articles,
  user
});
