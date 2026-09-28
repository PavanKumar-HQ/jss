/**
 * Legacy Data Adapter & Backward Compatibility Gateway
 * Re-exports canonical items from catalogueService to ensure zero breaking changes.
 */

import {
  catalogueService,
  CATEGORY_DEFINITIONS,
  CANONICAL_SERIES,
  CANONICAL_LANGUAGES,
  CANONICAL_PERIODICALS
} from '../services/catalogueService';

export const mockProducts = catalogueService.getBooksSync();

export const mockCategories = [
  "All Categories",
  ...Object.keys(CATEGORY_DEFINITIONS)
];

export const categoryDescriptions = Object.fromEntries(
  Object.entries(CATEGORY_DEFINITIONS).map(([cat, meta]) => [cat, meta.description])
);

export const mockSeries = CANONICAL_SERIES;
export const mockLanguages = CANONICAL_LANGUAGES;
export const mockPeriodicals = CANONICAL_PERIODICALS;

export const BOOKS = mockProducts;
export const CATEGORIES = mockCategories;
export const SERIES = mockSeries;

export const DataService = {
  getProducts: async () => catalogueService.getAllBooks(),
  getProductBySlug: async (slug) => catalogueService.getBookBySlug(slug),
  getCategories: async () => catalogueService.getCategories(),
  getPeriodicals: async () => catalogueService.getPeriodicals()
};
