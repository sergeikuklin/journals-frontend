import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import TextField from '~/components/TextField/TextField';
import Button from '~/components/Button/Button';

import * as validate from '~/utils/validate';

import './discounts-transfer-form.scss';

const FORM_NAME = 'TRANSFER_FORM';

class DiscountsTransferForm extends Component {
  render() {
    const { user, handleSubmit, t } = this.props;

    return (
      <form className="discounts-transfer-form form" onSubmit={ handleSubmit }>
        <div className="discounts-transfer-form__infobox">
          <p className="discounts-transfer-form__infobox__fullname">
            { user.last_name } { user.first_name } { user.middle_name }
          </p>
          <p className="discounts-transfer-form__infobox__info">
            { user.workplace }
          </p>
        </div>

        <div className="form__field">
          <div className="form__row">
            <div className="form__col form__col_4">
              <label htmlFor="bonus_count" className="form__label">
                { `Cумма для перевода (${ t('rub') }}.)` }
              </label>
              <Field name="bonus_count" id="bonus_count" type="number"
                     component={ TextField } placeholder="Введите сумму" validate={ [validate.required] } />
            </div>
            <div className="discounts-transfer-form__submit">
              <Button className="button_orange" type="submit">
                { t('transfer') }
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

DiscountsTransferForm = reduxForm({
  form: FORM_NAME,
  destroyOnUnmount: true
})(DiscountsTransferForm);

DiscountsTransferForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

DiscountsTransferForm = withNamespaces()(DiscountsTransferForm);

export default connect()(DiscountsTransferForm);
