import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, isInvalid, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import nanoid from 'nanoid';

import ArticleWizard from '~/components/ArticleWizard/ArticleWizard';
import ArticleCommonForm from '~/components/ArticleCommonForm/ArticleCommonForm';
import ArticleAuthorsForm from '~/components/ArticleAuthorsForm/ArticleAuthorsForm';
import ArticleContentForm from '~/components/ArticleContentForm/ArticleContentForm';
import Button from '~/components/Button/Button';
import Icon from '~/components/Icon/Icon';

import './article-form.scss';
import './assets/save.svg';

import { getRubricsArray } from '~/store/rubrics/selector';
import { getLanguagesArray } from '~/store/languages/selector';
import {  getRootCategoriesArray } from '~/store/categories/selector';

import getFinancingIds from '~/services/getFinancingIds';
import { deserializeArticleData } from '~/services/article';


const FORM_NAME = 'article-publish';

class ArticleForm extends Component {
  get formProps() {
    return {
      formName: FORM_NAME
    };
  }

  get wizardSteps() {
    return [
      {
        title: 'Общие сведения',
        component: <ArticleCommonForm { ...this.formProps } />
      },
      {
        title: 'Авторы',
        component: <ArticleAuthorsForm { ...this.formProps } />
      },
      {
        title: 'Текст статьи',
        component: <ArticleContentForm { ...this.formProps } />
      },
      {
        title: 'Файлы к статье',
        component: <div>Раздел в разработке</div>
      },
      {
        title: 'Список литературы',
        component: <div>Раздел в разработке</div>
      }
    ];
  }

  handleDraftSubmit = () => {
    const { formValues, onDraftSubmit } = this.props;
    onDraftSubmit(formValues);
  };

  renderTools = () => {
    const { handleSubmit, isInvalidForm } = this.props;
    return (
      <React.Fragment>
        <Button onClick={ this.handleDraftSubmit }>
          <Icon name="save" className="article-publish-form__save-icon" />
          Сохранить как черновик
        </Button>
        <Button className="button_orange" onClick={ handleSubmit } disabled={ isInvalidForm } >
          Отправить статью
        </Button>
      </React.Fragment>
    );
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="article-publish-form">
        <form onSubmit={ handleSubmit } />
        <div className="article-publish-form__wizard">
          <ArticleWizard steps={ this.wizardSteps } tools={ this.renderTools } />
        </div>
      </div>
    );
  }
}

ArticleForm = reduxForm({
  form: FORM_NAME,
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ArticleForm);

const initialAuthorHash = nanoid();

function mapStateToProps(state, props) {
  const isInvalidForm = isInvalid(FORM_NAME)(state);
  const formValues = getFormValues(FORM_NAME)(state);

  return {
    formValues,
    isInvalidForm,
    initialValues: getInitialValues(state, props)
  };
}

function getInitialValues(state, props) {
  const { user, articles } = state;
  const { id } = props;
  const rootCategoriesArray = getRootCategoriesArray(state);
  const rubricsArray = getRubricsArray(state);
  const languagesArray = getLanguagesArray(state);
  const financingIds = getFinancingIds();
  const data = deserializeArticleData(articles.data[id]);

  return {
    language: languagesArray.length ? languagesArray[0].id : null,
    rubric: rubricsArray.length ? rubricsArray[0].id : null,
    root_category: rootCategoriesArray.length ? rootCategoriesArray[0].id : null,
    financing_sources: [{
      type: financingIds[0]
    }],
    addresses: [{
      count: 1
    }],
    authors: [{
      id: user.data.id,
      isCurrent: true,
      source: 'search',
      hash: initialAuthorHash
    }],
    article_type: 0,
    blocks: [
      {
        title: 'Введение',
        hint: 'Подсказка про Введение',
        static: true
      },
      {
        title: 'Методы и принципы исследования'
      },
      {
        title: 'Основные результаты'
      },
      {
        title: 'Обсуждение'
      },
      {
        title: 'Заключение',
        hint: 'Подсказка про Заключение',
        static: true
      },
    ],
    ...data
  };
}

ArticleForm.propTypes = {
  id: PropTypes.number,
  onSubmit: PropTypes.func,
  onDraftSubmit: PropTypes.func
};

export default connect(mapStateToProps)(ArticleForm);
