import OptionTypeBase, { Props as SelectProps } from "react-select";
import ReactSelect, { GroupBase, OptionsOrGroups } from "react-select";

export interface OptionType {
  label: string;
  value: string;
}
export interface GroupedOptionsType {
  label: string;
  options: OptionType[];
}

export type OptionsType =
  | { [key: string]: string | { [key: string]: string } }
  | OptionType[]
  | GroupedOptionsType[];

export interface SelectPropsType
  extends Omit<SelectProps<OptionTypeBase>, "value" | "options"> {
  className?: string;
  name?: string;
  value?: OptionType | string | null;
  options: OptionsOrGroups<any, GroupBase<ReactSelect>>;
  styles?: any;
  label?: string;
}
