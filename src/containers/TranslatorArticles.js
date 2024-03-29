import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import TranslatorArticleList from '~/components/TranslatorArticleList/TranslatorArticleList';
import SearchPanel from '~/components/SearchPanel/SearchPanel';
import SearchableSelect from '~/components/SearchableSelect/SearchableSelect';
import LoaderWrapper from '~/components/LoaderWrapper/LoaderWrapper';

import * as articlesActions from '~/store/articles/actions';
import { getArticlesParams } from '~/store/articles/selector';
import apiClient from '~/services/apiClient';

class TranslatorArticles extends Component {
  componentDidMount() {
    this.handleInitialRequest();
  }

  handleInitialRequest = () => {
    return Promise.all([
      this.handleRequest()
    ]);
  };

  handleRequest = (params={}) => {
    const { articlesParams, fetchArticles } = this.props;
    return fetchArticles(null, { state_article: 'AWAIT_TRANSLATE', ...articlesParams, ...params });
  };

  get searchTargets() {
    const { t } = this.props;

    return [
      {
        value: 'title',
        title: t('search_in_titles')
      },
      {
        value: 'author',
        title: t('search_in_authors')
      },
      {
        value: 'doi',
        title: t('number')
      }
    ];
  }

  loadOptions = inputValue => {
    return new Promise(resolve => {
      if (!inputValue) resolve([]);
      apiClient.getArticleTags({ search_query: inputValue }).then(data => {
        const options = data.results.map(item => ({ label: item.text, value: item.id }));
        resolve(options);
      });
    });
  };

  get selectTagsProps() {
    const { t } = this.props;
    return {
      async: true,
      name: 'tags',
      loadOptions: this.loadOptions,
      placeholder: t('select_tag'),
      normalize: option => option.value,
      onChange: ({ value }) => {
        this.handleRequest({ filter: { tag_ids: value } });
      }
    };
  }

  render() {
    const { isPending, t } = this.props;
    return (
      <React.Fragment>
        <h1 className="page__title">
          { t('articles_in_work') }
        </h1>

        <div className="page__tools">
          <div className="form">
            <div className="form__field">
              <label className="form__label">
                { t('article_search') }
              </label>
              <SearchPanel targets={ this.searchTargets } onChange={ this.handleRequest } />
            </div>
            <div className="form__row">
              <div className="form__col form__col_6">
                <div className="form__field">
                  <label className="form__label">{ t('tags') }</label>
                  <SearchableSelect { ...this.selectTagsProps } />
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoaderWrapper isLoading={ isPending }>
          <TranslatorArticleList onUpdateRequest={ this.handleRequest } />
        </LoaderWrapper>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { articles } = state;
  return {
    isPending: articles.isPending,
    articlesParams: getArticlesParams(state)
  };
}

const mapDispatchToProps = {
  fetchArticles: articlesActions.fetchArticles
};

TranslatorArticles = withNamespaces()(TranslatorArticles);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatorArticles);
