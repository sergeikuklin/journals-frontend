import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import page from './page/reducer';
import languages from './languages/reducer';
import rubrics from './rubrics/reducer';
import categories from './categories/reducer';
import sites from './sites/reducer';
import articles from './articles/reducer';
import user from './user/reducer';
import users from './users/reducer';
import reviewInvites from './reviewInvites/reducer';
import discounts from './discounts/reducer';
import lawtypes from './lawtypes/reducer';
import countries from './countries/reducer';
import reviews from './reviews/reducer';
import roles from './roles/reducer';

export default combineReducers({
  form: formReducer,
  languages,
  rubrics,
  categories,
  page,
  sites,
  articles,
  user,
  users,
  reviewInvites,
  discounts,
  lawtypes,
  countries,
  reviews,
  roles
});

