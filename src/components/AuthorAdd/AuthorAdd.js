import React, { Component } from 'react';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import TextField from '~/components/TextField/TextField';
import AuthorChooser from '~/components/AuthorChooser/AuthorChooser';
import Collapse from '~/components/Collapse/Collapse';
import AuthorCreateForm from '~/components/AuthorCreateForm/AuthorCreateForm';
import Checkbox from '~/components/Checkbox/Checkbox';
import FieldHint from '~/components/FieldHint/FieldHint';
import Radio from '~/components/Radio/Radio';

import { getRolesArray } from '~/store/roles/selector';
import { getUserData } from '~/store/user/selector';
import { searchUsers, createUser, insertUser } from '~/store/users/actions';

import './author-add.scss';

class AuthorAdd extends Component {
  get sources() {
    const { t } = this.props;
    return [
      { value: 'search', title: t('find_in_system') },
      { value: 'create', title: t('create_author') }
    ];
  }

  handleSearchChange = (event) => {
    const { searchUsers, data } = this.props;
    const { value } = event.target;
    const { hash } = data;

    const searchQuery = {
      search_query: value
    };

    searchUsers(hash, searchQuery);
  };

  handleAuthorChoose = (id, index) => {
    const { field, formName, change, insertUser, searchData, data } = this.props;
    const { hash } = data;
    insertUser(searchData[hash][index]);
    change(formName, `${field}.id`, id);
  };

  handleCorrespondingAuthor = (event) => {
    const { authorData, change, formName } = this.props;
    const { checked } = event.target;
    if (checked) {
      change(formName, 'corresponding_author', authorData.id);
    } else {
      change(formName, 'corresponding_author', null);
    }
  };

  handleAuthorCreate = (data) => {
    const { createUser, field, formName, change } = this.props;
    createUser(data).then(({ value }) => {
      if (value.id !== undefined) {
        change(formName, `${field}.id`, value.id);
      }
    }).catch(error => console.error(error));
  };

  renderSources = () => {
    const { field } = this.props;

    return this.sources.map(item => (
      <Field name={ `${field}.source` } key={ item.value } value={ item.value }
             type="radio" component={ Radio } >
        { item.title }
      </Field>
    ));
  };

  render() {
    const { t, field, authorData, correspondingAuthor,
            authorsArray, data, authorRolesArray } = this.props;
    const { source, isCurrent, hash } = data;

    return (
      <div className="author-add">
        { authorData !== undefined ?
          <div className="author-add__current">
            <div className="author-add__person">
              <div className="author-add__name">
                { `${authorData.last_name} ${authorData.first_name} ${authorData.middle_name || ''}` }
              </div>
              { (authorData.workplace || authorData.study_place) &&
                <div className="author-chooser__info">
                  { authorData.workplace || authorData.study_place }
                </div>
              }
            </div>
            <div className="form__field form__field_inline">
              <Checkbox name="isCorrespondingAuthor" checked={ authorData.id ===  correspondingAuthor }
                        onChange={ this.handleCorrespondingAuthor }>
                { isCurrent ? t('i_am_corresponding_author') : t('corresponding_author') }
              </Checkbox>
              <FieldHint text={ 'Подсказка про корреспондента' } />
            </div>
            { authorRolesArray.length > 0 && (
              <div className="author-add__roles">
                <Collapse
                  title={
                    <React.Fragment>
                      { isCurrent ? t('my_role_in_preparation_article') : t('role_in_preparation_article') }
                      <FieldHint text={ 'Подсказка про роли' } />
                    </React.Fragment>
                  }>
                  <div className="author-add__roles-box">
                    <ul className="author-add__roles-list">
                      { authorRolesArray.map(role => (
                        <li className="author-add__roles-role" key={ role.id }>
                          <Field type="checkbox" name={ `${field}.roles.role-${role.id}` }
                                 value={ role.id } component={ Checkbox }>
                            { role.name }
                          </Field>
                        </li>
                      )) }
                    </ul>
                  </div>
                </Collapse>
              </div>
            ) }
          </div> :
          <div className="author-add__form">
            <h3 className="author-add__title">{ t('add_author') }</h3>
            <Field name={ `${field}.id` } type="hidden" component={ TextField } />

            <div className="form__field">
              { this.renderSources() }
            </div>

            { source === 'search' &&
              <React.Fragment>
                <div className="form__field">
                  <Field name={ `${field}.search` } id="search" icon="search" component={ TextField }
                         placeholder={ t('search') } className="text-field_white text-field_search"
                         onChange={ this.handleSearchChange } />
                </div>

                <div className="author-add__list">
                  <AuthorChooser data={ authorsArray } onChoose={ this.handleAuthorChoose } />
                </div>
              </React.Fragment>
            }

            { source === 'create' &&
              <div className="form__field">
                <AuthorCreateForm formName={ `author-create[${hash}]` }
                                  onSubmit={ this.handleAuthorCreate }/>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

AuthorAdd.defaultProps = {
  authorsArray: []
};

function mapStateToProps(state, props) {
  const { formName, field, data } = props;
  const { users } = state;
  const { isCurrent } = data;

  const formSelector = formValueSelector(formName);
  const hash = formSelector(state, `${field}.hash`);
  const id = formSelector(state, `${field}.id`);
  const correspondingAuthor = formSelector(state, 'corresponding_author');
  const authorRolesArray = getRolesArray(state);
  const userData = getUserData(state);
  return {
    correspondingAuthor,
    authorData: isCurrent ? userData : users.data[id],
    authorsArray: users.searchData[hash],
    searchData: users.searchData,
    authorRolesArray,
  };
}

const mapDispatchToProps = {
  change,
  searchUsers,
  createUser,
  insertUser
};

AuthorAdd = withNamespaces()(AuthorAdd);


export default connect(mapStateToProps, mapDispatchToProps)(AuthorAdd);
