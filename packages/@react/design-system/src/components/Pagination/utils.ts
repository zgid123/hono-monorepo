export type TPaginationItem = number | 'ellipsis-end' | 'ellipsis-start';

interface ICreateVisiblePaginationItemsParams {
  page: number;
  totalPages: number;
}

export function createVisiblePaginationItems({
  page,
  totalPages,
}: ICreateVisiblePaginationItemsParams): TPaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const visiblePages = [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((first, second) => first - second);

  return visiblePages.flatMap((item, index) => {
    const previousItem = visiblePages[index - 1];

    if (previousItem && item - previousItem > 1) {
      const ellipsis = previousItem === 1 ? 'ellipsis-start' : 'ellipsis-end';

      return [ellipsis, item];
    }

    return [item];
  });
}
