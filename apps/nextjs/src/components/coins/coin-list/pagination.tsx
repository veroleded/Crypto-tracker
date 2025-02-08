"use client";

import { useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@acme/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handleFirstPage = useCallback(() => onPageChange(1), [onPageChange]);
  const handlePrevPage = useCallback(
    () => onPageChange(currentPage - 1),
    [currentPage, onPageChange],
  );
  const handleNextPage = useCallback(
    () => onPageChange(currentPage + 1),
    [currentPage, onPageChange],
  );
  const handleLastPage = useCallback(
    () => onPageChange(totalPages),
    [onPageChange, totalPages],
  );

  const paginationText = useMemo(
    () => `Page ${currentPage} of ${totalPages}`,
    [currentPage, totalPages],
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFirstPage}
        disabled={isFirstPage}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevPage}
        disabled={isFirstPage}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-sm">{paginationText}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={isLastPage}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLastPage}
        disabled={isLastPage}
        aria-label="Go to last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
