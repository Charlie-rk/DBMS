// src/hooks/useValidation.js
import { useState, useEffect, useCallback } from "react";
import validationSchema from "./validationSchema";

const useValidation = (data, handleSubmit, onError) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    setSubmitting(true);
  };

  const reset = useCallback(() => {
    setTouched(false);
    setSubmitting(false);
    setErrors({});
  }, []);

  const checkForError = useCallback(async () => {
    if (!touched) return;
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      if (submitting) handleSubmit();
    } catch (err) {
      setSubmitting(false);
      const errorObj = {};
      err.inner.forEach((error) => {
        errorObj[error.path] = error.message;
      });
      setErrors(errorObj);
      if (submitting && onError) onError();
    }
  }, [data, touched, submitting, handleSubmit, onError]);

  useEffect(() => {
    checkForError();
  }, [checkForError]);

  return { errors, onSubmit, reset };
};

export default useValidation;
