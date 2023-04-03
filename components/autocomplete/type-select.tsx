import React from "react";
import { Entity } from "./types";

type Props = {
  value?: Entity;
  onChange: (value: Entity) => void;
};
export const TypeSelect: React.FC<Props> = ({ value, onChange }) => {
  const types = Object.keys(Entity);
  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange(e.target.value as Entity);

  return (
    <div className="w-1/4">
      <label
        htmlFor="resultType"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select result type
      </label>
      <select
        id="resultType"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={value}
        onChange={handleSelect}
      >
        {types.map((type) => (
          <option key={`select-${type}`} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
