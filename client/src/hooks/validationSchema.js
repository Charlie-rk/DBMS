// src/hooks/validationSchema.js
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 characters required")
    .required("This field is required"),
  username: Yup.string()
    .min(3, "Minimum 3 characters required")
    .required("This field is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("This field is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Select a valid gender")
    .required("This field is required"),
  dob: Yup.date().required("This field is required"),
  pincode: Yup.string().required("This field is required"),
  street: Yup.string().required("This field is required"),
  city: Yup.string().required("This field is required"),
  state: Yup.string().required("This field is required"),
  country: Yup.string().required("This field is required"),
  role: Yup.string()
    .oneOf(
      ["Admin", "Front Desk Operator", "Doctor", "Data Entry Operator"],
      "Select a valid role"
    )
    .required("This field is required"),
  specialization: Yup.string().when("role", {
    is: "Doctor",
    then: Yup.string()
      .min(3, "Minimum 3 characters required")
      .required("Specialization is required"),
    otherwise: Yup.string().notRequired(),
  }),
});

export default validationSchema;
