import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import nanoid from 'nanoid';

import ArticleSourceList from '~/components/ArticleSourceList/ArticleSourceList';

class ArticleSourcesForm extends Component {
  renderSourceList = (props) => {
    const { formName } = this.props;

    const initialValues = {
      isEdit: true,
      hash: nanoid()
    };

    return (
      <ArticleSourceList formName={ formName } legend="Источник" addText="Добавить источник"
                         initialValues={ initialValues } { ...props } />
    );
  };

  render() {
    return (
      <div className="article-sources">
        <h2 className="page__title">Список литературы</h2>
        <div className="form__field">
          <FieldArray name="sources" rerenderOnEveryChange={ true }
                      component={ this.renderSourceList } />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
)(ArticleSourcesForm);
