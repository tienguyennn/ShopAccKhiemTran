import { createConstant } from "./Constant";

const DepartmentTypeConstant = createConstant(
  {
    Organization: "Organization",
    Department: "Department",
  } as const,
  {
    Organization: { displayName: "" },
    Department: { displayName: "" },
  }
);

export default DepartmentTypeConstant;
