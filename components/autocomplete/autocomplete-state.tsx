import React from "react";

type Props = {
  isError?: boolean;
  children?: JSX.Element | string;
};

export const AutocompleteState: React.FC<Props> = ({ isError, children }) => {
  return isError ? (
    <div
      className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
      data-testid="autocomplete-state-error"
    >
      <span className="font-medium">Error occurred!</span>
      {children}
    </div>
  ) : (
    <h5
      data-testid="autocomplete-state-info"
      className="text-xl font-bold leading-none text-gray-900 dark:text-white"
    >
      {children}
    </h5>
  );
};
