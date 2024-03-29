import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import './paginator.scss';

class Paginator extends Component {
  handleChange = (event) => {
    const { onChange } = this.props;
    let { value } = event.target;
    value = value ? parseInt(value, 10) : 1;
    onChange(value);
  };

  handleStart = () => {
    const { onChange } = this.props;
    onChange(1);
  };

  handleEnd = () => {
    const { onChange, total } = this.props;
    onChange(total);
  };

  handlePrev = () => {
    const { current, onChange } = this.props;
    const prev = current - 1;
    if (prev > 0) {
      onChange(prev);
    }
  };

  handleNext = () => {
    const { current, total, onChange } = this.props;
    const next = current + 1;
    if (next <= total) {
      onChange(next);
    }
  };

  render() {
    const { t, total, current } = this.props;

    return (
      <div className="paginator">
        <button type="button" className="paginator__button paginator__button_start"
                onClick={ this.handleStart }>
          В начало
        </button>
        <button type="button" className="paginator__button paginator__button_prev"
                onClick={ this.handlePrev }>
          { t('prev') }
        </button>

        <div className="paginator__holder">
          <input type="text" className="paginator__input" value={ current }
                 pattern="\d*" onChange={ this.handleChange } />
          <span className="paginator__total">из { total }</span>
        </div>

        <button type="button" className="paginator__button paginator__button_next"
                onClick={ this.handleNext }>
          { t('next') }
        </button>
        <button type="button" className="paginator__button paginator__button_end"
                onClick={ this.handleEnd }>
          В Конец
        </button>
      </div>
    );
  }
}

Paginator.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func
};

Paginator = withNamespaces()(Paginator);

export default Paginator;
