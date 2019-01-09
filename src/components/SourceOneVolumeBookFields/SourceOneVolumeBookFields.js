import React from 'react';
import { Field } from 'redux-form';

import ReqMark from '~/components/ReqMark/ReqMark';
import TextField from '~/components/TextField/TextField';
import * as validate from '~/utils/validate';

const SourceOneVolumeBookFields = () => {
  return (
    <React.Fragment>
      <div className="form__field">
        <label htmlFor="source_author" className="form__label">
          Автор <ReqMark />
        </label>
        <Field name="author" id="source_author" className="text-field_white" component={ TextField }
               placeholder="Введите имя автора" validate={ [validate.required] } />
      </div>

      <div className="form__field">
        <label htmlFor="original_source_name" className="form__label">
          Название на языке оригинала <ReqMark />
        </label>
        <Field name="original_name" id="original_source_name" className="text-field_white" component={ TextField }
               placeholder="Введите название" validate={ [validate.required] } />
      </div>

      <div className="form__field">
        <label htmlFor="second_source_name" className="form__label">
          Название на английском языке
        </label>
        <Field name="second_source_name" id="second_source_name" className="text-field_white" component={ TextField }
               placeholder="Введите название" />
      </div>

      <div className="form__field">
        <label htmlFor="source_issue" className="form__label">
          Издательство <ReqMark />
        </label>
        <Field name="issue" id="source_issue" className="text-field_white" component={ TextField }
               placeholder="Введите название" validate={ [validate.required] } />
      </div>

      <div className="form__field">
        <label htmlFor="source_issue_city" className="form__label">
          Город издания <ReqMark />
        </label>
        <Field name="issue_city" id="source_issue_city" className="text-field_white" component={ TextField }
               placeholder="Введите название" validate={ [validate.required] } />
      </div>

      <div className="form__field">
        <div className="form__row">
          <div className="form__col form__col_6">
            <label htmlFor="source_issue_year" className="form__label">
              Год издания <ReqMark />
            </label>
            <Field name="issue_year" id="source_issue_year" className="text-field_white" component={ TextField }
                   placeholder="Введите название" validate={ [validate.required] } />
          </div>
          <div className="form__col form__col_6">
            <label htmlFor="page_count" className="form__label">
              Количество стр. <ReqMark />
            </label>
            <Field name="page_count" id="page_count" className="text-field_white" component={ TextField }
                   placeholder="0 стр." validate={ [validate.required] } />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SourceOneVolumeBookFields;