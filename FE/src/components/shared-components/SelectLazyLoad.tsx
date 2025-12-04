import duLieuDanhMucService from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import { ParentQueryType, SelectDM_DuLieuLazyRequestType } from "@/types/dM_DuLieuDanhMuc/request";
import { ApiResponse, DropdownOption, PagedList } from "@/types/general";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import "./SelectLazyLoad.css";

interface Props {
    groupCode: string;
    name?: string;
    selectedValueProp?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    onChangeLabel?: (value: string) => void;
    fetchData: (model: SelectDM_DuLieuLazyRequestType) => Promise<ApiResponse<PagedList<DropdownOption>>>;
    parentQuerySelect?: ParentQueryType[];
    isLoad?: boolean;
}

// Sử dụng forwardRef để AntD Form có thể nhận diện
const SelectLazyLoad = forwardRef<any, Props>(
    (
        {
            groupCode,
            placeholder = "--Vui lòng chọn--",
            value,
            onChange: propOnChange,
            className,
            fetchData,
            selectedValueProp,
            onChangeLabel,
            parentQuerySelect,
            isLoad = true,
        }: Props,
        ref
    ) => {
        const [dataSelect, setDataSelect] = useState<DropdownOption[]>([]);
        const [search, setSearch] = useState<string>("");
        const [placeholderText, setPlaceholderText] = useState<string>(placeholder);
        const [selectedValue, setSelectedValue] = useState<string>(value || "");
        const [pageIndex, setPageIndex] = useState<number>(1);
        const [isOpen, setIsOpen] = useState(false);
        const [totalCount, setTotalCount] = useState<number>(0);
        const [countItemRender, setCountItemRender] = useState<number>(0);
        const [isLoading, setIsLoading] = useState(false);
        const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);
        const listRef = useRef<HTMLUListElement>(null);
        const searchInputRef = useRef<HTMLInputElement>(null);

        // Đồng bộ giá trị từ Form vào component
        useEffect(() => {
            setSelectedValue(value || "");
        }, [value]);

        // Focus vào ô tìm kiếm khi mở dropdown
        useEffect(() => {
            if (isOpen && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, [isOpen]);
        const loadData = async (page = 1) => {
            setIsLoading(true);
            if (!isLoad) return;

            const model = {
                pageIndex: page,
                pageSize: 20,
                groupCode,
                filterName: search,
                selected: selectedValueProp || "",
                parentQuery: parentQuerySelect
            };
            console.log("parent", parentQuerySelect);

            try {

                const res = await fetchData(model);
                const items = res.data.items || [];

                if (page === 1) {
                    setDataSelect(items);
                    setCountItemRender(items.length);
                } else {
                    setDataSelect(prev => {
                        const map = new Map();
                        [...prev, ...items].forEach(i => map.set(i.value, i));
                        return Array.from(map.values());
                    });

                    setCountItemRender(prev => prev + items.length);
                }

                setTotalCount(res.data.totalCount || 0);

            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            if (pageIndex > 1) {
                loadData(pageIndex);
            }
        }, [pageIndex]);
        useEffect(() => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            const timeout = setTimeout(() => {
                setPageIndex(1);
                setDataSelect([]);
                setCountItemRender(0);

                loadData(1); // Gọi API sau 1s không nhập
            }, 1000);

            setTypingTimeout(timeout);
        }, [search, groupCode, parentQuerySelect]);


        useEffect(() => {
            const handler = (e: MouseEvent) => {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, []);

        const handleScroll = () => {
            const el = listRef.current;
            if (!el || isLoading || countItemRender >= totalCount) return;

            const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

            if (isAtBottom) {
                setPageIndex((prev) => prev + 1);
            }
        };
        const handleSelect = (val: string, label: string) => {
            setPlaceholderText(label);
            setSelectedValue(val);
            propOnChange?.(val); // GỌI ONCHANGE CHO ANTD FORM
            setIsOpen(false);
        };

        // Tìm label hiện tại dựa trên propValue (từ Form)
        const selectedLabel =
            dataSelect.find((x) => x.value === value)?.label || placeholderText;

        // Expose methods nếu cần (focus, blur,...)
        useImperativeHandle(ref, () => ({
            focus: () => {
                setIsOpen(true);
            },
            blur: () => {
                setIsOpen(false);
            },
        }));

        return (
            <div className={`relative ${className}`} ref={wrapperRef}>


                {/* Input hiển thị */}
                <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-300 hover:border-gray-400 hover:shadow-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex justify-between items-center opacity-75">
                        <span
                            className={`${!selectedValue ? "text-gray-500" : "text-gray-900"
                                }`}
                        >
                            {selectedLabel}
                        </span>
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg animate-dropdown">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200 animate-search-appear">
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Danh sách options */}
                        <ul
                            ref={listRef}
                            className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            onScroll={handleScroll}
                        >
                            {dataSelect.length === 0 && !isLoading ? (
                                <li className="px-3 py-4 text-sm text-gray-500 text-center animate-fade-in">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-gray-300 mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {search ? "Không tìm thấy kết quả" : "Không có dữ liệu"}
                                    </div>
                                </li>
                            ) : (
                                dataSelect.map((item, index) => (
                                    <li
                                        key={`${item.value || "empty"}-${index}`}
                                        className={`
                      px-3 py-2 text-sm cursor-pointer transition-all duration-200
                      ${item.value === value
                                                ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500"
                                                : "hover:bg-gray-50 text-gray-900 border-l-4 border-transparent hover:border-gray-300"
                                            }
                      animate-item-appear
                    `}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        onClick={() => {
                                            handleSelect(item.value, item.label)
                                            onChangeLabel != null ? onChangeLabel(item.label):"";
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{item.label}</span>
                                            {item.value === value && (
                                                <svg
                                                    className="w-4 h-4 text-blue-500 animate-check-appear"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </li>
                                ))
                            )}

                            {/* Loading indicator */}
                            {isLoading && (
                                <li className="px-3 py-3 text-sm text-gray-500 text-center animate-pulse">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div
                                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "100ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "200ms" }}
                                            ></div>
                                        </div>
                                        <span>Đang tải...</span>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {/* Footer info */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-3 py-2 animate-footer-appear">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 font-medium">
                                    {countItemRender} / {totalCount}
                                </span>
                                {countItemRender < totalCount && !isLoading && (
                                    <span className="text-blue-500 font-semibold animate-pulse">
                                        Cuộn để tải thêm...
                                    </span>
                                )}
                                {countItemRender >= totalCount && countItemRender > 0 && (
                                    <span className="text-green-500 font-semibold">
                                        Tất cả bản ghi đã được tải
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${Math.min(
                                            (countItemRender / totalCount) * 100,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

// Đặt tên để debug dễ hơn
SelectLazyLoad.displayName = "SelectLazyLoad";

export default SelectLazyLoad;