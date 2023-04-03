import Image from "next/image";
import { Entity } from "./types";

type Props = {
  name: string;
  avatar: string;
  url: string;
  description?: string;
  type: Entity;
  hovered: boolean;
};

export const ResultItem: React.FC<Props> = ({
  name,
  description,
  avatar,
  url,
  hovered,
}) => {
  return (
    <li
      data-testid="result-item"
      className={`py-3 px-2 sm:py-4 ${hovered ? "bg-gray-100" : ""}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Image
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            src={avatar}
            alt={name}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {description || ""}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <a
            href={url}
            target="_blank"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Visit
          </a>
        </div>
      </div>
    </li>
  );
};
