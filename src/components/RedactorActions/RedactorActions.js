import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import RedactorReview from '~/components/RedactorReview/RedactorReview';
import RedactorDecision from '~/components/RedactorDecision/RedactorDecision';
import ArticleHistory from '~/components/ArticleHistory/ArticleHistory';

import isShowDecision from '~/services/isShowDecision';

import './redactor-actions.scss';

class RedactorActions extends Component {
  state = {
    actionIndex: null
  };

  get actions() {
    const { t, articleId, articleState } = this.props;

    const actions = [
      {
        title: t('review_action'),
        component: <RedactorReview articleId={ articleId } />
      },
      {
        title: t('history'),
        component: <ArticleHistory articleId={ articleId } />
      }
    ];

    if (isShowDecision(articleState)) {
      actions.push({
        title: t('decision'),
        component: <div className="redactor-actions__decision">
          <RedactorDecision articleId={ articleId } />
        </div>
      });
    }

    return actions;
  }

  handleTabToggle = (event) => {
    let { index } = event.currentTarget.dataset;
    index = parseInt(index, 10);
    this.setState(({ actionIndex }) => {
      const newIndex = index !== actionIndex ? index : null;
      return { actionIndex: newIndex };
    });
  };

  renderTabs = () => {
    const { actionIndex } = this.state;
    return this.actions.map((item, index) => {
      const tabItemClasses = classNames('redactor-actions__tab-item',
        { 'redactor-actions__tab-item_active': index === actionIndex });
      return (
        <li key={ index } className={ tabItemClasses }>
          <button type="button" className="redactor-actions__tab" data-index={ index }
                  onClick={ this.handleTabToggle }>
            { item.title }
          </button>
        </li>
      );
    });
  };

  renderPanels = () => {
    const { actionIndex } = this.state;
    return this.actions.filter((item, index) => index === actionIndex).map((item, index) => (
      <div key={ index } className="redactor-actions__panel">
        { item.component }
      </div>
    ));
  };

  render() {
    const { actionIndex } = this.state;
    const tabListClasses = classNames('redactor-actions__tab-list',
      { 'redactor-actions__tab-list_active': actionIndex !== null });
    return (
      <div className="redactor-actions">
        <ul className={ tabListClasses }>
          { this.renderTabs() }
        </ul>
        { this.renderPanels() }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { articles } = state;
  const { articleId } = props;

  return {
    articleState: articles.data[articleId] && articles.data[articleId].state_article
  };
}

RedactorActions = withNamespaces()(RedactorActions);

export default connect(
  mapStateToProps
)(RedactorActions);
