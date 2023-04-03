import React, { useState, useEffect, ChangeEventHandler } from "react";
import { AutocompleteInput } from "./autocomplete-input";
import { ResultsContainer } from "./results-container";
import { AutocompleteState } from "./autocomplete-state";
import { useGithubSearch } from "./useGithubSearch";
import { useDebounce } from "./useDebounce";

export const Autocomplete = () => {
  const [inputString, setInputString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const query = useDebounce(inputString, 100);
  const { result, isLoading, isError, isSuccess, isEmpty } = useGithubSearch({
    query,
    enabled: query?.length > 3,
    page,
    size,
  });

  useEffect(() => {
    if (isSuccess) setSelectedIndex(0);
  }, [isSuccess]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          setSelectedIndex((prevIndex: number) =>
            prevIndex === 0 ? result.items.length - 1 : prevIndex - 1
          );
          break;
        case "ArrowDown":
          setSelectedIndex((prevIndex: number) =>
            prevIndex === result.items.length - 1 ? 0 : prevIndex + 1
          );
          break;
        case "Enter":
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [result, selectedIndex]);

  const hasNoResults =
    isEmpty || isError || isLoading || !isSuccess || query.length === 0;

  const renderPlaceholder = () => {
    return query.length === 0 ? (
      <AutocompleteState>Search more than 390M repositories</AutocompleteState>
    ) : isError ? (
      <AutocompleteState isError={true}>
        Try again in sometime or contact support.
      </AutocompleteState>
    ) : isEmpty ? (
      <AutocompleteState>{`We couldn't find any repositories matching '${query}'`}</AutocompleteState>
    ) : isLoading ? (
      <AutocompleteState>Loading...</AutocompleteState>
    ) : null;
  };

  return (
    <div
      className={`h-screen flex justify-center ${
        isSuccess && !isEmpty ? "" : "items-center"
      }`}
    >
      <div className="w-1/3 flex flex-col gap-y-6">
        <div>
          <AutocompleteInput value={inputString} onChange={setInputString} />
        </div>
        {hasNoResults ? (
          renderPlaceholder()
        ) : (
          <div className="max-h-80">
            <ResultsContainer selectedIndex={selectedIndex} results={result} />
          </div>
        )}
      </div>
    </div>
  );
};
