// src/steps.js
import Info from "../components/info";
import Address from "../components/Address";
import Role from "../components/Role";
import Summary from "../components/Summary";
import Success from "../components/Success";

export const steps = [
  { title: "Basic Info", Component: Info },
  { title: "Address Details", Component: Address },
  { title: "Role Selection", Component: Role },
  { title: "Summary", Component: Summary },
];

export const SuccessPage = Success;
