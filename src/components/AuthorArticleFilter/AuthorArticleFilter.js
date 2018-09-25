import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Select from '~/components/Select/Select';
import Search from '~/components/Search/Search';

import * as sitesActions from '~/store/sites/actions';
import {getSitesArray} from '~/store/sites/selector';

import './author-article-filter.scss';

class AuthorArticleFilter extends Component {
  componentDidMount() {
    const { fetchSites } = this.props;
    fetchSites();
  }

  get journalsOptions() {
    const { sitesArray } = this.props;
    return sitesArray.map(site => ({
      title: site.name,
      value: site.id
    }));
  }

  handleSiteChange = (event) => {
    const { value:siteId } = event.target;
    const { onFilterChange, setCurrentSite } = this.props;
    setCurrentSite(siteId);
    onFilterChange();
  };
  
  handleSearchChange = (data) => {
    const { onFilterChange } = this.props;
    onFilterChange({ search: data });
  };

  get searchTargets() {
    return [
      {
        value: 'title',
        title: 'Искать в заголовках'
      }
    ];
  }

  render() {
    const { currentSite } = this.props;
    return (
      <div className="author-article-filter">
        <form className="form">
          <div className="form__field">
            <label htmlFor="sites-list" className="form__label">Для журнала</label>
            <Select id="sites-list" options={ this.journalsOptions } onChange={ this.handleSiteChange } />
          </div>
          <div className="form__field">
            <label className="form__label">Поиск статьи</label>
            <Search value={ currentSite } targets={ this.searchTargets } onChange={ this.handleSearchChange } />
          </div>
        </form>
      </div>
    );
  }
}

AuthorArticleFilter.propTypes = {
  onFilterChange: PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentSite: state.sites.current,
    sitesArray: getSitesArray(state)
  };
}

const mapDispatchToProps = {
  fetchSites: sitesActions.fetchSites,
  setCurrentSite: sitesActions.setCurrent
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorArticleFilter);
