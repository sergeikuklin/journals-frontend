import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change, Field, FieldArray, formValueSelector } from 'redux-form';
import nanoid from 'nanoid';
import Dropzone from 'react-dropzone';
import { withNamespaces } from 'react-i18next';

import Checkbox from '~/components/Checkbox/Checkbox';
import FileDropPlaceholder from '~/components/FileDropPlaceholder/FileDropPlaceholder';
import ArticleSourceList from '~/components/ArticleSourceList/ArticleSourceList';
import DownloadLink from '~/components/DownloadLink/DownloadLink';

import fileToBase64 from '~/utils/fileToBase64';
import * as validate from '~/utils/validate';
import { getUserData } from '~/store/user/selector';

import './article-sources-form.scss';

class ArticleSourcesForm extends Component {
  constructor(props) {
    super(props);
    const { list_literature_file } = this.props;
    this.state = {
      isFile: !!list_literature_file
    };
  }

  renderSourceList = (props) => {
    const { formName, t } = this.props;

    const initialValues = {
      isEdit: true,
      hash: nanoid()
    };

    return (
      <ArticleSourceList formName={ formName } legend={ t('source') } addText={ t('add_source') }
                         initialValues={ initialValues } { ...props } />
    );
  };

  handleChange = () => {
    this.setState({ isFile: !this.state.isFile });
  };

  handleDropFiles = (files) => {
    const { change, formName } = this.props;
    const file = files[0];
    const filePromise = fileToBase64(file);

    return filePromise.then((base64) => {
      change(formName, 'list_literature_file', base64);
    });
  };

  render() {
    const { isFile } = this.state;
    const { t, isProofreading, articleData } = this.props;
    return (
      <div className="article-sources-form">
        <h2 className="page__title">{ t('source_list') }</h2>

        { isProofreading && isFile ?
          <div className="article-sources-form__file">
            <DownloadLink file={ articleData.list_literature_file } name={ t('source_list') } />
          </div>
          :
          <div className="form__field">
            <Checkbox value={ isFile } checked={ isFile }
                      onChange={ this.handleChange }>
              { t('add_file_with_list') }
            </Checkbox>
            <div className="article-content-form__description">
              При добавлении списка литературы файлом, стоимость размещения увеличится на 30%
            </div>
          </div>
        }

        { isFile && !isProofreading ?
          <div className="form__field">
            <Dropzone className="article-content-form__dropzone" multiple={ false }
                      accept=".doc, .docx, .rtf"
                      maxSize={ 50 * Math.pow(1024, 2) }
                      onDrop={ this.handleDropFiles }>
              <FileDropPlaceholder />
            </Dropzone>
            <Field name="list_literature_file" type="hidden" component="input"
                   validate={ [validate.required] } />
          </div> :
          <div className="form__field">
            <FieldArray name="sources" rerenderOnEveryChange={ true }
                        component={ this.renderSourceList } />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { articles } = state;
  const { formName, articleId } = props;
  const formSelector = formValueSelector(formName);
  const list_literature_file = formSelector(state, 'list_literature_file');
  const { role:userRole } = getUserData(state);
  const isCorrector = userRole === 'CORRECTOR';
  const articleData = articles.data[articleId];

  return {
    isProofreading: isCorrector && articleData.state_article === 'AWAIT_PROOFREADING',
    list_literature_file,
    articleData
  };
}

const mapDispatchToProps = {
  change
};

ArticleSourcesForm = withNamespaces()(ArticleSourcesForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSourcesForm);
