import { useQueries, useQuery, UseQueryResult } from "react-query";
import { User, Repository, Result, Results, Entity } from "./types";

type SearchParams = {
  size: number;
  enabled?: boolean;
  query: string;
  page?: number;
};

interface UseGithubSearchResult {
  result?: Results;
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  isEmpty?: boolean;
  isIdle?: boolean;
}

type QueryResults = [
  UseQueryResult<Result<User>, Error>,
  UseQueryResult<Result<Repository>, Error>
];

const fetchUsers = async ({
  query,
  page,
  size,
}: SearchParams): Promise<Result<User> | undefined> => {
  const res = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(
      query
    )}&type:user&per_page=${size}&page=${page}`
  );

  if (!res.ok) {
    return;
  }
  return (await res.json()) as Result<User>;
};

const fetchRepositories = async ({
  query,
  page,
  size,
}: SearchParams): Promise<Result<Repository> | undefined> => {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query
    )}&per_page=${size}&page=${page}`
  );
  if (!res.ok) {
    return;
  }
  return (await res.json()) as Result<Repository>;
};

export const useGithubSearch = (
  options: SearchParams
): UseGithubSearchResult => {
  // const queries: UseQueryOptions<Result<User>, Error>[] = [
  //   {
  //     queryKey: ["users", options.query],
  //     queryFn: () => fetchUsers(options),
  //     enabled: !!options.enabled,
  //     onErrorThrow: true,
  //     retry: false,
  //   },
  //   {
  //     queryKey: ,
  //     queryFn: () => fetchRepositories(options),
  //     enabled: !!options.enabled,
  //     onErrorThrow: true,
  //     retry: false,
  //   },
  // ];
  try {
    const users = useQuery<Result<User> | undefined, Error>(
      ["users", options.query],
      () => fetchUsers(options),
      {
        enabled: !!options.enabled,
        retry: false,
      }
    );
    const repositories = useQuery<Result<Repository> | undefined, Error>(
      ["repositories", options.query],
      () => fetchRepositories(options),
      {
        enabled: !!options.enabled,
        retry: false,
      }
    );

    const isError = repositories == undefined || users === undefined;
    if (isError)
      return {
        isError: true,
      };
    const isLoading = users.isLoading || repositories.isLoading;
    if (isLoading) {
      return {
        isLoading,
      };
    }
    if (users.isIdle || repositories.isIdle) {
      return {
        isIdle: true,
      };
    }

    const isSuccess = users.isSuccess && repositories.isSuccess;
    const isEmpty =
      users.data?.total_count === 0 && repositories.data?.total_count === 0;
    const totalCount = users.data!.total_count + repositories.data!.total_count;
    const allResults = [...users.data!.items, ...repositories.data!.items].sort(
      (a: any, b: any) => {
        const name1 =
          "type" in a ? a.login.toLowerCase() : a.full_name.toLowerCase();
        const name2 =
          "type" in b ? b.login.toLowerCase() : b.full_name.toLowerCase();
        if (name1 < name2) {
          return -1;
        }
        if (name1 > name2) {
          return 1;
        }
        return 0;
      }
    );
    const result = {
      items: allResults,
      total_count: totalCount,
    } as Results;

    return { isLoading, isEmpty, isError, result, isSuccess };
  } catch (error) {
    return {
      isError: true,
    };
  }
};
