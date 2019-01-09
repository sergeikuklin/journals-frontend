import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from '~/components/Menu/Menu';
import RedactorArticleList from '~/components/RedactorArticleList/RedactorArticleList';

import * as usersActions from '~/store/users/actions';
import * as articlesActions from '~/store/articles/actions';
import { getArticlesParams } from '~/store/articles/selector';

class RedactorArticles extends Component {
  componentDidMount() {
    this.handleInitialRequest();
  }

  handleInitialRequest = () => {
    const { fetchUsers } = this.props;
    return Promise.all([
      fetchUsers({ role: 'REVIEWER' }),
      this.handleRequest()
    ]);
  };

  handleRequest = (params={}) => {
    const { articlesParams, fetchArticles } = this.props;
    return fetchArticles(null, { ...articlesParams, ...params });
  };

  get menuItems() {
    return [
      {
        title: 'Мои статьи',
        href: '/'
      },
      {
        title: 'Мои скидки',
        href: '/second'
      },
      {
        title: 'Настройки',
        href: '/'
      }
    ];
  }

  render() {
    return (
      <React.Fragment>
        <aside className="page__sidebar">
          <Menu items={ this.menuItems } />
        </aside>

        <article className="page__content">
          <h1 className="page__title">Мои статьи</h1>
          <RedactorArticleList onUpdateRequest={ this.handleRequest } />
        </article>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    articlesParams: getArticlesParams(state)
  };
}

const mapDispatchToProps = {
  fetchUsers: usersActions.fetchUsers,
  fetchArticles: articlesActions.fetchArticles
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RedactorArticles);