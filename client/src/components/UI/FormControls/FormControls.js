import React from 'react';
import classes from './FormControls.module.css'
import {Field} from "redux-form";

const FormControls = ({input, meta, elementType, ...props}) => {
  const hasError = meta.touched && meta.error
  return (
    <div className={classes.formControl + " " + (hasError ? classes.error : "")}>
      <div>
        {React.createElement(elementType, {...input, ...props})}
      </div>
      {hasError && <span>{meta.error}</span>}
    </div>
  );
}

export const Textarea = (props) => {
  return <FormControls {...props} elementType="textarea"/>
}

export const Input = (props) => {
  return <FormControls {...props} elementType="input"/>
}

export const createField = (name, placeholder, component, validate = [], props = {}, text = '') => {
  return (
    <div>
      <Field name={name} validate={validate} placeholder={placeholder}
             component={component} {...props} /> {text}
    </div>
  )
}

