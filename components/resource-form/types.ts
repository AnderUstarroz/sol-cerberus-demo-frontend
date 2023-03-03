import { ResourceDataType } from "../../pages/index-types";

export interface ResourceFormType {
  data: ResourceDataType;
  setData: Function;
  modals: { [k: string]: boolean };
  setModals: Function;
}
