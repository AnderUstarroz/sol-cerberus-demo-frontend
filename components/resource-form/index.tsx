import dynamic from "next/dynamic";
import { useState } from "react";
import { ErrorType } from "../../types/index-types";
import { flashMsg } from "../utils/helpers";
import { ResourceFormType } from "./types";

const Input = dynamic(() => import("../input"));
const Button = dynamic(() => import("../button"));

export default function ResourceForm({
  data,
  setData,
  modals,
  setModals,
}: ResourceFormType) {
  const [errors, setErrors] = useState<ErrorType>({});
  const handleValidate = (field: string) => {
    setErrors({});
    let errors: { [k: string]: string } = {};
    if (!data.color || !/^#[0-9a-fA-F]{6}$/.test(data.color)) {
      errors.color = `Invalid color`;
    }
    if (!Number.isInteger(data.size) || data.size > 200 || data.size < 0) {
      errors.size = `Invalid ${data.resource} size, must be an integer between 0 and 200`;
    }
    if (Object.keys(errors).length) {
      setErrors(
        Object.entries(errors).reduce((acc, [error, errorMsg]) => {
          if (error === field || !field) {
            flashMsg(errorMsg);
            acc[error] = errorMsg;
          }
          return acc;
        }, {})
      );
      return false;
    }
    return true;
  };

  return (
    <div>
      <h3 className="mb-big">{`${data.action} ${data.resource}`}</h3>
      <p className="mb-big">{`${data.action} color and size to the ${data.resource}`}</p>
      <div className="aligned mb-big">
        <label className="overlap fullCol">
          <Input
            className="fullWidth"
            type="color"
            name="color"
            autoComplete="off"
            value={data.color}
            style={{
              height: 41,
              borderColor: errors.color ? "#BD2742" : "unset",
            }}
            maxLength="7"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, color: e.target.value })
            }
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              handleValidate("color")
            }
          />
          <span>Color</span>
        </label>
        <label className="overlap fullCol">
          <Input
            className="fullWidth"
            name="size"
            type="number"
            step={1}
            max={200}
            min={0}
            autoComplete="off"
            value={data.size}
            style={
              errors.size
                ? {
                    borderColor: "#BD2742",
                  }
                : undefined
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                size: /^-?\d+$/.test(e.target.value)
                  ? parseInt(e.target.value)
                  : "",
              })
            }
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              handleValidate("size")
            }
          />
          <span>Size</span>
        </label>
      </div>
      <div className="aligned centered">
        <Button
          onClick={() => {
            if (handleValidate(null)) {
              data.func(data.resource, data.color.slice(1), data.size);
            }
          }}
        >
          {data.action}
        </Button>
        <Button
          className="button1"
          onClick={() => setModals({ ...modals, resourceForm: false })}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
