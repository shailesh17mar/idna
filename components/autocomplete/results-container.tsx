import React from "react";
import { Autocomplete } from "./autocomplete";
import { AutocompleteState } from "./autocomplete-state";
import { ResultItem } from "./result-item";
import { Entity, Repository, Results, User } from "./types";

type Props = {
  results: Results;
  selectedIndex: number;
};
export const ResultsContainer: React.FC<Props> = ({
  results: { items, total_count },
  selectedIndex,
}) => {
  const renderItems = () => {
    const renderUserItem = (item: User, i: number) => (
      <ResultItem
        key={`repository_${item.id}`}
        name={item.login}
        url={item.html_url}
        avatar={item.avatar_url}
        type={Entity.User}
        hovered={selectedIndex === i}
      />
    );
    const renderRepository = (item: Repository, i: number) => (
      <ResultItem
        key={`user_${item.id}`}
        name={item.full_name}
        url={item.html_url}
        avatar={item.owner.avatar_url}
        type={Entity.Repository}
        hovered={selectedIndex === i}
      />
    );

    return items.map((item: User | Repository, i) => {
      const isUser = "type" in item;
      return isUser
        ? renderUserItem(item as User, i)
        : renderRepository(item as Repository, i);
    });
  };

  return (
    <div
      data-testid="results-container"
      className="mt-6 w-full py-4 bg-white border border-gray-200 rounded-lg shadow sm:py-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-2 mb-4">
        <AutocompleteState>{`${total_count} results found`}</AutocompleteState>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {renderItems()}
        </ul>
      </div>
    </div>
  );
};
