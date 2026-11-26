import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseIsoDate(value?: string | null): { year: number; month: number; day: number } | null {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    if (month < 0 || month > 11 || day < 1 || day > 31) return null;
    return { year, month, day };
}

function toIsoDate(year: number, month: number, day: number): string {
    return `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    minYear?: number;
    maxYear?: number;
    defaultYear?: number;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Select date',
    required = false,
    disabled = false,
    clearable = true,
    minYear = 1940,
    maxYear = new Date().getFullYear() + 10,
    defaultYear,
    className,
}: DatePickerProps) {
    const parsed = parseIsoDate(value);
    const now = new Date();
    const initialYear = parsed?.year ?? defaultYear ?? now.getFullYear();
    const initialMonth = parsed?.month ?? (defaultYear ? 0 : now.getMonth());

    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(initialYear);
    const [viewMonth, setViewMonth] = useState(initialMonth);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (parsed) {
            setViewYear(parsed.year);
            setViewMonth(parsed.month);
        }
    }, [value]);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const years = useMemo(() => {
        const list: number[] = [];
        for (let y = maxYear; y >= minYear; y--) {
            list.push(y);
        }
        return list;
    }, [minYear, maxYear]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const cells: Array<{ day: number | null }> = [];
        for (let i = 0; i < firstDay; i++) cells.push({ day: null });
        for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
        while (cells.length % 7 !== 0) cells.push({ day: null });
        return cells;
    }, [viewYear, viewMonth]);

    const prevMonth = () => {
        if (viewMonth === 0) {
            if (viewYear > minYear) {
                setViewMonth(11);
                setViewYear((y) => y - 1);
            }
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            if (viewYear < maxYear) {
                setViewMonth(0);
                setViewYear((y) => y + 1);
            }
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const selectDay = (day: number) => {
        onChange(toIsoDate(viewYear, viewMonth, day));
        setOpen(false);
    };

    const selectToday = () => {
        const t = new Date();
        const y = Math.min(Math.max(t.getFullYear(), minYear), maxYear);
        setViewYear(y);
        setViewMonth(t.getMonth());
        onChange(toIsoDate(y, t.getMonth(), t.getDate()));
        setOpen(false);
    };

    const displayLabel = parsed
        ? `${String(parsed.day).padStart(2, '0')} ${SHORT_MONTHS[parsed.month]} ${parsed.year}`
        : '';

    return (
        <div ref={rootRef} className="relative w-full">
            {required && (
                <input
                    tabIndex={-1}
                    aria-hidden="true"
                    required
                    value={value}
                    onChange={() => {}}
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                />
            )}
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!open && !parsed) {
                        setViewYear(defaultYear ?? now.getFullYear());
                        setViewMonth(defaultYear ? 0 : now.getMonth());
                    }
                    setOpen((prev) => !prev);
                }}
                className={cn(
                    'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-[#DBDFE9] bg-[#FCFCFC] px-3 text-left text-[13px] font-normal text-[#071437] transition-all duration-200 hover:border-[#C4CADA] focus:border-[#1B84FF] focus:bg-white focus:ring-[3px] focus:ring-[#1B84FF]/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                    !displayLabel && 'text-[#99A1B7]',
                    className,
                )}
            >
                <span className="flex min-w-0 items-center gap-2 truncate">
                    <CalendarIcon className="size-4 shrink-0 text-[#78829D]" />
                    <span className="truncate">{displayLabel || placeholder}</span>
                </span>
                {clearable && displayLabel && !disabled && (
                    <span
                        role="button"
                        tabIndex={-1}
                        aria-label="Clear date"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                        className="rounded p-0.5 text-[#99A1B7] hover:bg-[#F1F1F4] hover:text-[#071437]"
                    >
                        <X className="size-3.5" />
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 z-[70] mt-1.5 w-[290px] rounded-xl border border-[#F1F1F4] bg-white p-3 text-[#071437] shadow-[0_14px_38px_-8px_rgba(7,20,55,0.22)]">
                    {/* Month & Year Controls */}
                    <div className="mb-3 flex items-center justify-between gap-1.5">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#F1F1F4] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="size-4" />
                        </button>

                        <div className="flex min-w-0 flex-1 items-center gap-1">
                            <select
                                value={viewMonth}
                                onChange={(e) => setViewMonth(Number(e.target.value))}
                                aria-label="Month"
                                className="h-7 min-w-0 flex-1 cursor-pointer rounded-md border border-[#DBDFE9] bg-[#FCFCFC] px-1.5 text-[12px] font-semibold text-[#071437] outline-none focus:border-[#1B84FF]"
                            >
                                {MONTHS.map((m, idx) => (
                                    <option key={m} value={idx}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={viewYear}
                                onChange={(e) => setViewYear(Number(e.target.value))}
                                aria-label="Year"
                                className="h-7 w-[72px] cursor-pointer rounded-md border border-[#DBDFE9] bg-[#FCFCFC] px-1.5 text-[12px] font-semibold text-[#071437] outline-none focus:border-[#1B84FF]"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={nextMonth}
                            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#F1F1F4] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                            aria-label="Next month"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="mb-1 grid grid-cols-7 text-center">
                        {WEEKDAYS.map((wd) => (
                            <div key={wd} className="py-1 text-[11px] font-semibold text-[#99A1B7]">
                                {wd}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-0.5 text-center">
                        {calendarDays.map((cell, idx) => {
                            if (cell.day === null) {
                                return <div key={`empty-${idx}`} className="h-8" />;
                            }
                            const isSelected =
                                parsed?.year === viewYear &&
                                parsed?.month === viewMonth &&
                                parsed?.day === cell.day;
                            const isToday =
                                now.getFullYear() === viewYear &&
                                now.getMonth() === viewMonth &&
                                now.getDate() === cell.day;

                            return (
                                <button
                                    key={cell.day}
                                    type="button"
                                    onClick={() => selectDay(cell.day!)}
                                    className={cn(
                                        'flex h-8 w-full cursor-pointer items-center justify-center rounded-md text-[12.5px] font-medium transition-colors',
                                        isSelected
                                            ? 'bg-[#1B84FF] font-semibold text-white'
                                            : isToday
                                              ? 'border border-[#1B84FF]/40 bg-[#F1F6FF] font-semibold text-[#1B84FF]'
                                              : 'text-[#071437] hover:bg-[#F1F6FF] hover:text-[#1B84FF]',
                                    )}
                                >
                                    {cell.day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F1F4] pt-2">
                        {clearable ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setOpen(false);
                                }}
                                className="cursor-pointer rounded px-2 py-1 text-[11.5px] font-semibold text-[#78829D] hover:bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                Clear
                            </button>
                        ) : (
                            <span />
                        )}
                        <button
                            type="button"
                            onClick={selectToday}
                            className="cursor-pointer rounded px-2 py-1 text-[11.5px] font-semibold text-[#1B84FF] hover:bg-[#F1F6FF]"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
