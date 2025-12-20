import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import * as React from 'react';

interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    showClearButton?: boolean;
    debounceMs?: number;
    containerClassName?: string;
}

function SearchInput({
    value,
    onChange,
    onClear,
    showClearButton = true,
    debounceMs = 300,
    placeholder = 'Cari...',
    className,
    containerClassName,
    ...props
}: SearchInputProps) {
    const [localValue, setLocalValue] = React.useState(value);
    const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (debounceMs > 0) {
            debounceRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceMs);
        } else {
            onChange(newValue);
        }
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
        onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    };

    React.useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className={cn('relative', containerClassName)}>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                type="text"
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn('pr-9 pl-9', className)}
                {...props}
            />

            {showClearButton && localValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}

interface SearchInputWithLabelProps extends SearchInputProps {
    label?: string;
    labelClassName?: string;
}

function SearchInputWithLabel({
    label,
    labelClassName,
    ...props
}: SearchInputWithLabelProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className={cn('text-sm font-medium', labelClassName)}>
                    {label}
                </label>
            )}
            <SearchInput {...props} />
        </div>
    );
}

export { SearchInput, SearchInputWithLabel };
