import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';

import TextField from '~/components/TextField/TextField';
import Button from '~/components/Button/Button';
import Select from '~/components/Select/Select';
import Icon from '~/components/Icon/Icon';
import Radio from '~/components/Radio/Radio';
import SourceThesisFields from '~/components/SourceThesisFields/SourceThesisFields';
import SourceArticleSerialEditionFields from '~/components/SourceArticleSerialEditionFields/SourceArticleSerialEditionFields';
import SourceOneVolumeBookFields from '~/components/SourceOneVolumeBookFields/SourceOneVolumeBookFields';
import SourceMultiVolumeBookFields from '~/components/SourceMultiVolumeBookFields/SourceMultiVolumeBookFields';
import SourceElectronic from '~/components/SourceElectronic/SourceElectronic';
import SourceLegislativeMaterial from '~/components/SourceLegislativeMaterial/SourceLegislativeMaterial';
import SourceStandart from '~/components/SourceStandart/SourceStandart';
import SourcePatent from '~/components/SourcePatent/SourcePatent';

import { getLanguagesArray } from '~/store/languages/selector';
import { getRubricsArray } from '~/store/rubrics/selector';
import { getCountriesArray } from '~/store/countries/selector';

import * as countriesActions from '~/store/countries/actions';

import getSourceTypes from '~/services/getSourceTypes';
import getRightholderTypes from '~/services/getRightholderTypes';
import * as validate from '~/utils/validate';

import './article-source-create-form.scss';
import './assets/save.svg';

class ArticleSourceCreateForm extends Component {
  handleSubmit = (formData) => {
    const { field, onSubmit } = this.props;
    // Для многотомного и Однотомного изданий принимается массив авторов
    // const multiAuthorsFields = ['SourceMultiVolumeBook', 'SourceElectronic'];
    // if (!!~multiAuthorsFields.indexOf(formData.resourcetype)) {
    //   formData.author = [{ id: 1, initials: 'П. И.', lastname: formData.author }];
    // }

    formData.author = { initials: formData.initials, lastname: formData.lastname };

    onSubmit(field, { ...formData, isValid: true });
  };

  get rubricsOptions() {
    const { rubricsArray } = this.props;
    return rubricsArray.map(item => ({
      title: item.name,
      value: item.id
    }));
  }

  get languagesOptions() {
    const { languagesArray } = this.props;
    return languagesArray.map(item => ({
      title: item.name,
      value: item.id
    }));
  }

  handleFetchCountries = (value) => {
    const { fetchCountries } = this.props;
    return fetchCountries({ name: value, limit: 5 });
  };

  get thesisCategories() {
    return [{
      title: 'Кандидатская',
      value: 1,
    }, {
      title: 'Докторская',
      value: 2
    }]
  }

  renderThesisCategories = () => {
    return this.thesisCategories.map((item, index) => (
      <Field key={ index } name="category" value={ item.value }
             type="radio" component={ Radio }>
        { item.title }
      </Field>
    ));
  };

  get specialFields() {
    const { resourceType, rightholderType, countriesArray } = this.props;
    switch (resourceType) {
      case 'SourceThesis':
        return <SourceThesisFields rubricsOptions={ this.rubricsOptions }
                                   languagesOptions={ this.languagesOptions }
                                   countriesOptions={ countriesArray }
                                   onCountriesFetch={ this.handleFetchCountries }/>;

      case 'SourceArticleSerialEdition':
        return <SourceArticleSerialEditionFields />;

      case 'SourceOneVolumeBook':
        return <SourceOneVolumeBookFields />;

      case 'SourceMultiVolumeBook':
        return <SourceMultiVolumeBookFields />;

      case 'SourceElectronic':
        return <SourceElectronic rubricsOptions={ this.rubricsOptions } />;

      case 'SourceLegislativeMaterial':
        return <SourceLegislativeMaterial countriesOptions={ countriesArray } />;

      case 'SourceStandart':
        return <SourceStandart />;

      case 'SourcePatent':
        return <SourcePatent countriesOptions={ countriesArray }
                             rightholderType={ rightholderType }
                             rightholderOptions={ getRightholderTypes() }
                             onCountriesFetch={ this.handleFetchCountries }/>;

      default:
        return null;
    }
  }

  render() {
    const { handleSubmit, resourceType } = this.props;
    return (
      <form className="article-source-create-form form" onSubmit={ handleSubmit(this.handleSubmit) }>
        <div className="form__field">
          <div className="form__row">
            <div className="form__col form__col_6">
              <label htmlFor="resourcetype" className="form__label">
                Тип источника
              </label>
              <Field name="resourcetype" id="resourcetype" className="select_white" validate={ [validate.required] }
                     component={ props => <Select options={ getSourceTypes() } { ...props } /> } />
            </div>
            { resourceType === 'SourceThesis' ?
              <div className="form__col form__col_6">
                <label htmlFor="category" className="form__label">
                  Тип диссертации
                </label>
                <div className="form__box form__box_radios">
                  { this.renderThesisCategories() }
                </div>
              </div> :
              <div className="form__col form__col_6">
                <label htmlFor="source_language" className="form__label">
                  Язык оригинала
                </label>
                <Field name="language" id="source_language" className="select_white"
                       component={ props => <Select options={ this.languagesOptions } { ...props } /> } />
              </div>
            }
          </div>
        </div>

        { this.specialFields }

        <div className="form__field">
          <div className="form__row">
            <div className="form__col form__col_4">
              <label htmlFor="source_url" className="form__label">
                URL публикации
              </label>
              <Field name="url" id="source_url" className="text-field_white" component={ TextField }
                     placeholder="Введите URL" />
            </div>
            <div className="form__col form__col_4">
              <label htmlFor="source_doi" className="form__label">
                DOI
              </label>
              <Field name="doi" id="source_doi" className="text-field_white" component={ TextField }
                     placeholder="Введите DOI" />
            </div>
            <div className="form__col form__col_4">
              <label htmlFor="source_position" className="form__label">
                № в списке
              </label>
              <Field name="position" id="source_position" className="text-field_white" component={ TextField }
                     placeholder="Введите номер" />
            </div>
          </div>
        </div>

        <div className="form__field">
          <Button type="submit">
            <Icon name="save" className="article-source-create-form__save-icon" />
            Сохранить
          </Button>
        </div>
      </form>
    );
  }
}

ArticleSourceCreateForm = reduxForm({
  destroyOnUnmount: false
})(ArticleSourceCreateForm);

function mapStateToProps(state, props) {
  const { formName, data } = props;
  const formSelector = formValueSelector(formName);
  const languagesArray = getLanguagesArray(state);
  const rubricsArray = getRubricsArray(state);
  const resourceType = formSelector(state, 'resourcetype');
  const rightholderType = parseInt(formSelector(state, 'rightholder'), 10);
  const rightholderTypes = getRightholderTypes();
  const sourceTypes = getSourceTypes();
  const countriesArray = getCountriesArray(state);
  return {
    form: formName,
    languagesArray,
    rubricsArray,
    resourceType,
    rightholderType,
    countriesArray,
    initialValues: {
      language: languagesArray.length ? languagesArray[0].id : null,
      rubric: rubricsArray.length ? rubricsArray[0].id : null,
      resourcetype: sourceTypes[0].value,
      rightholder: rightholderTypes[0].value,
      defense_country: countriesArray.length ? countriesArray[0].id : [],
      // defense_country: 132, // Россия
      defense_date: moment().format('YYYY-MM-DD'),
      statement_date: moment().format('YYYY-MM-DD'),
      standart_entry_date: moment().format('YYYY-MM-DD'),
      adoption_date: moment().format('YYYY-MM-DD'),
      approval_date: moment().format('YYYY-MM-DD'),
      patent_application_date: moment().format('YYYY-MM-DD'),
      publication_date: moment().format('YYYY-MM-DD'),
      ...data
    }
  };
}

const mapDispatchToProps = {
  fetchCountries: countriesActions.fetchCountries
};


export default connect(mapStateToProps, mapDispatchToProps)(ArticleSourceCreateForm);

