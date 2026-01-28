'use client'

import { useEffect, useState } from 'react'
import { filters, singleFilter } from "./FilterData";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import ProductCard from './ProductCard'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from "../../../Redux/Customers/Product/Action";

const sortOptions = [
  { name: 'Price: Low to High', value: 'price_low', current: false },
  { name: 'Price: High to Low', value: 'price_high', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { customersProduct } = useSelector((store) => store);

  // FIX 1: Extract levelThree correctly (was "lavelThree" - typo)
  const { levelOne, levelTwo, levelThree } = param;

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);

  // Extract filter values
  const colorValues = searchParams.getAll("color");
  const sizeValues = searchParams.getAll("size");
  const priceValue = searchParams.get("price");
  const discount = searchParams.get("discount");
  const sortValue = searchParams.get("sort");
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const stock = searchParams.get("stock");

  // FIX 2: Better filter handling with toggle support
  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);

    // Convert to array if comma-separated string
    if (filterValues.length === 1 && filterValues[0].includes(',')) {
      filterValues = filterValues[0].split(',');
    }

    // Toggle the filter value
    if (filterValues.includes(value)) {
      filterValues = filterValues.filter((item) => item !== value);
    } else {
      filterValues.push(value);
    }

    // Update URL
    searchParams.delete(sectionId);
    if (filterValues.length > 0) {
      filterValues.forEach(v => searchParams.append(sectionId, v));
    }

    // Reset to page 1 when filters change
    searchParams.set("page", "1");
    
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    searchParams.set("page", "1"); // Reset to page 1
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('sort', value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FIX 3: Clear all filters function
  const handleClearFilters = () => {
    navigate({ search: '' });
  };

  // FIX 4: Check if any filters are applied
  const hasActiveFilters = colorValues.length > 0 || 
                          sizeValues.length > 0 || 
                          priceValue || 
                          discount;

  // FIX 5: Improved data fetching
  useEffect(() => {
    const [minPrice, maxPrice] = priceValue === null
      ? [0, 100000]
      : priceValue.split("-").map(v => Number(v || 0));

    const data = {
      category: levelThree,              // FIX: Use levelThree instead of lavelThree
      colors: colorValues,               // array
      sizes: sizeValues,                 // array
      minPrice: Number(minPrice || 0),
      maxPrice: Number(maxPrice || 100000),
      minDiscount: Number(discount || 0),
      sort: sortValue || "price_low",
      pageNumber: (pageNumber - 1) || 0, // backend expects 0-based page
      pageSize: 12,
      stock: stock,
    };

    console.log("=== FETCHING PRODUCTS ===");
    console.log("Category:", levelThree);
    console.log("Colors:", colorValues);
    console.log("Sizes:", sizeValues);
    console.log("Price Range:", minPrice, "-", maxPrice);
    console.log("Page:", pageNumber);
    console.log("========================");
    
    dispatch(findProducts(data));
  }, [
    levelThree,
    location.search,
    dispatch
  ]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white shadow-2xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="size-6" />
                </button>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="px-6 py-3 border-b border-gray-200">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Filters */}
              <form className="flex-1 overflow-y-auto">
                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 px-6 py-4">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon className="size-5 group-data-open:hidden" />
                          <MinusIcon className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-4">
                      <div className="space-y-3">
                        {section.options.map((option, optionIdx) => {
                          const isChecked = section.id === 'color' 
                            ? colorValues.includes(option.value)
                            : section.id === 'size'
                            ? sizeValues.includes(option.value)
                            : false;

                          return (
                            <div key={option.value} className="flex items-center gap-3">
                              <input
                                onChange={() => handleFilter(option.value, section.id)}
                                checked={isChecked}
                                id={`filter-mobile-${section.id}-${optionIdx}`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                className="text-sm text-gray-600 cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {singleFilter.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 px-6 py-4">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon className="size-5 group-data-open:hidden" />
                          <MinusIcon className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-4">
                      <FormControl fullWidth>
                        <RadioGroup>
                          {section.options.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio size="small" />}
                              label={option.label}
                              onChange={(e) => handleRadioFilterChange(e, section.id)}
                              sx={{ 
                                '& .MuiFormControlLabel-label': { 
                                  fontSize: '0.875rem',
                                  color: '#4b5563'
                                }
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section - Modern Design */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pt-24 pb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {levelThree?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'New Arrivals'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {customersProduct?.products?.totalElements || 0} products found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Menu */}
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all">
                  Sort
                  <ChevronDownIcon className="size-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </MenuButton>

                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-hidden transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => handleSortChange(option.value)}
                          className={classNames(
                            sortValue === option.value 
                              ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                              : 'text-gray-700 hover:bg-gray-50',
                            'flex w-full items-center px-4 py-2 text-sm transition-colors'
                          )}
                        >
                          {option.name}
                          {sortValue === option.value && (
                            <span className="ml-auto text-indigo-600">✓</span>
                          )}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all lg:hidden"
              >
                <FunnelIcon className="size-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 py-4">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {colorValues.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  onDelete={() => handleFilter(color, 'color')}
                  size="small"
                  sx={{ 
                    bgcolor: '#eef2ff',
                    color: '#4f46e5',
                    '& .MuiChip-deleteIcon': { color: '#4f46e5' }
                  }}
                />
              ))}
              {sizeValues.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  onDelete={() => handleFilter(size, 'size')}
                  size="small"
                  sx={{ 
                    bgcolor: '#faf5ff',
                    color: '#7c3aed',
                    '& .MuiChip-deleteIcon': { color: '#7c3aed' }
                  }}
                />
              ))}
              <button
                onClick={handleClearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">Products</h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FilterAltIcon className="text-indigo-600" />
                      Filters
                    </h2>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <form className="space-y-4">
                    {filters.map((section) => (
                      <Disclosure key={section.id} as="div" defaultOpen className="border-b border-gray-200 pb-4">
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-semibold text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon className="size-5 group-data-open:hidden" />
                              <MinusIcon className="size-5 group-not-data-open:hidden" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-4">
                          <div className="space-y-3">
                            {section.options.map((option, optionIdx) => {
                              const isChecked = section.id === 'color' 
                                ? colorValues.includes(option.value)
                                : section.id === 'size'
                                ? sizeValues.includes(option.value)
                                : false;

                              return (
                                <div key={option.value} className="flex items-center gap-3">
                                  <input
                                    onChange={() => handleFilter(option.value, section.id)}
                                    checked={isChecked}
                                    id={`filter-${section.id}-${optionIdx}`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}

                    {singleFilter.map((section) => (
                      <Disclosure key={section.id} as="div" defaultOpen className="border-b border-gray-200 pb-4">
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-semibold text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon className="size-5 group-data-open:hidden" />
                              <MinusIcon className="size-5 group-not-data-open:hidden" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-4">
                          <FormControl fullWidth>
                            <RadioGroup>
                              {section.options.map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={<Radio size="small" />}
                                  label={option.label}
                                  onChange={(e) => handleRadioFilterChange(e, section.id)}
                                  sx={{ 
                                    '& .MuiFormControlLabel-label': { 
                                      fontSize: '0.875rem',
                                      color: '#4b5563'
                                    }
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form>
                </div>
              </div>

              {/* Product Grid */}
              <div className="lg:col-span-4 w-full">
                {customersProduct?.loading ? (
                  <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-sm">
                    <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
                    <p className="text-lg text-gray-600 mt-6">Loading amazing products...</p>
                  </div>
                ) : customersProduct?.error ? (
                  <div className="flex flex-col justify-center items-center h-96 bg-red-50 rounded-2xl border-2 border-red-200">
                    <div className="text-6xl mb-4">😕</div>
                    <p className="text-lg text-red-600 font-semibold">Oops! Something went wrong</p>
                    <p className="text-sm text-red-500 mt-2">{customersProduct.error}</p>
                  </div>
                ) : !customersProduct?.products?.content || customersProduct?.products?.content?.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg text-gray-600 font-semibold">No products found</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customersProduct.products.content.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Pagination Section - Modern Design */}
          {customersProduct?.products?.totalPages > 1 && (
            <section className="pb-12">
              <div className="flex justify-center">
                <div className="bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-200">
                  <Pagination
                    count={customersProduct.products.totalPages}
                    page={pageNumber}
                    onChange={handlePaginationChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }
                    }}
                  />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}