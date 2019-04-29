import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import Renderer from '~/components/Renderer/Renderer';
import ReviewsHistory from '~/components/ReviewsHistory/ReviewsHistory';

import './content.scss';

class Content extends Component {
  renderBlocks = blocks => {
    return blocks.map((item, index) => (
      <div className="content__block" key={ index }>
        <h2 className="content__title">{ `${index + 1}. ${item.title}` }</h2>
        <Renderer raw={ item.content } />
      </div>
    ));
  };

  renderFinancingSources = sources => {
    return sources.map((item, index) => (
      <li key={ index }>
        <p>
          { item.organization +
            ', ' +
            item.grant_name +
            ', ' +
            item.grant_number }
        </p>
      </li>
    ));
  };

  renderSourcesList = () => {
    const { data } = this.props;
    return data.sources.map((item, index) => {
      const authorName = item.author ? `${ item.author.lastname } ${ item.author.initials },` : '';
      return (
        <li key={ index }>
          <p>
            { authorName }, { item.original_name }, { ' ' }
            { item.page_count } c.
          </p>
        </li>
      )
    });
  };

  render() {
    const { t, data, author } = this.props;
    const { content_blocks = [], financing_sources = [] } = data;
    const reviews = data.reviews.filter(item => item.recommendation === 1);

    return (
      <div className="content">
        { data.text_to_description && (
          <React.Fragment>
            <h2 className="content__title">{ t('annotation') }</h2>
            <p>{ data.text_to_description }</p>
            { data.text_to_keywords && (
              <div className="content__keywords">
                <div className="content__keywords-title">{ t('keywords') }</div>
                <div className="content__keywords-text">
                  { data.text_to_keywords }
                </div>
              </div>
            ) }
          </React.Fragment>
        ) }

        <div className="content__main">{ this.renderBlocks(content_blocks) }</div>

        <div className="content__footer">
          <div className="content__additional">
            <h3>{ t('additional_materials') }</h3>
            <p>{ t('not_specified') }</p>
          </div>
          <div className="content__financing">
            <h3>{ t('financing') }</h3>
            { financing_sources ? (
              <ul> { this.renderFinancingSources(financing_sources) } </ul>
            ) : (
              <p>
                { ' ' }
                Авторы не получали финансовой поддержки для проведения
                исследования, написания и публикации статьи
              </p>
            ) }
          </div>
          <div className="content__thanks">
            <h3>Благодарности</h3>
            { data.thanks_text ? <p>{ data.thanks_text }</p> : <p>{ t('not_specified') }</p> }
          </div>
          <div className="content__conflict">
            <h3>{ t('conflict_of_interest') }</h3>
            { data.conflict_interest ? (
              <p>{ data.conflict_interest }</p>
            ) : (
              <p>Не указан</p>
            ) }
          </div>
          { data.sources && (
            <div className="content__literature">
              <h3>{ t('source_list') }</h3>
              <ul>{ this.renderSourcesList() }</ul>
            </div>
          ) }
          { reviews && (
            <div className="content__reviews">
              <h3>{ t('review') }</h3>
              <ReviewsHistory
                reviews={ reviews }
                author={ author }
                className="reviews-history_publish"
              />
            </div>
          ) }
        </div>
      </div>
    );
  }
}

Content = withNamespaces()(Content);

export default Content;
