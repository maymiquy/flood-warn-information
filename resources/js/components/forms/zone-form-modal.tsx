import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { RiskLevel } from '@/config/map.config';
import { cn } from '@/lib/utils';
import type { FloodZonePolygon, PolygonCoordinate } from '@/types/map';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

export interface ZoneFormData {
    name: string;
    description: string;
    risk_level: RiskLevel;
    coordinates: PolygonCoordinate[];
    color?: string;
}

export interface ZoneFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    zone?: FloodZonePolygon | null;
    onSuccess?: (zone: FloodZonePolygon) => void;
}

interface FormErrors {
    name?: string;
    description?: string;
    risk_level?: string;
    coordinates?: string;
    general?: string;
}

const RISK_LEVEL_OPTIONS: { value: RiskLevel; label: string }[] = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
];

const EXAMPLE_COORDINATES = `[
  [-6.1751, 106.8650],
  [-6.1755, 106.8700],
  [-6.1800, 106.8700],
  [-6.1800, 106.8650]
]`;

export function ZoneFormModal({
    open,
    onOpenChange,
    zone,
    onSuccess,
}: ZoneFormModalProps) {
    const isEditing = !!zone;

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [riskLevel, setRiskLevel] = React.useState<RiskLevel>('low');
    const [coordinatesText, setCoordinatesText] = React.useState('');
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            if (zone) {
                setName(zone.name);
                setDescription(zone.description || '');
                setRiskLevel(zone.riskLevel);
                setCoordinatesText(JSON.stringify(zone.coordinates, null, 2));
            } else {
                setName('');
                setDescription('');
                setRiskLevel('low');
                setCoordinatesText('');
            }
            setErrors({});
        }
    }, [open, zone]);

    const validateCoordinates = (text: string): PolygonCoordinate[] | null => {
        try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) {
                return null;
            }

            if (parsed.length < 3) {
                return null;
            }

            for (const coord of parsed) {
                if (!Array.isArray(coord) || coord.length !== 2) {
                    return null;
                }
                if (
                    typeof coord[0] !== 'number' ||
                    typeof coord[1] !== 'number'
                ) {
                    return null;
                }

                if (coord[0] < -11 || coord[0] > 6) {
                    return null;
                }
                if (coord[1] < 95 || coord[1] > 141) {
                    return null;
                }
            }

            return parsed as PolygonCoordinate[];
        } catch {
            return null;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nama zona harus diisi';
        } else if (name.trim().length > 255) {
            newErrors.name = 'Nama zona maksimal 255 karakter';
        }

        if (description.length > 1000) {
            newErrors.description = 'Deskripsi maksimal 1000 karakter';
        }

        if (!riskLevel) {
            newErrors.risk_level = 'Tingkat risiko harus dipilih';
        }

        if (!coordinatesText.trim()) {
            newErrors.coordinates = 'Koordinat polygon harus diisi';
        } else {
            const coords = validateCoordinates(coordinatesText);
            if (!coords) {
                newErrors.coordinates =
                    'Format koordinat tidak valid. Harus berupa array [[lat, lng], ...] dengan minimal 3 titik';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const coordinates = validateCoordinates(coordinatesText);
            if (!coordinates) {
                throw new Error('Invalid coordinates');
            }

            const formData: ZoneFormData = {
                name: name.trim(),
                description: description.trim() || '',
                risk_level: riskLevel,
                coordinates,
            };

            const url = isEditing
                ? `/api/flood-zones/${zone.id}`
                : '/api/flood-zones';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    const serverErrors: FormErrors = {};
                    for (const [key, messages] of Object.entries(
                        result.errors,
                    )) {
                        serverErrors[key as keyof FormErrors] = Array.isArray(
                            messages,
                        )
                            ? messages[0]
                            : String(messages);
                    }
                    setErrors(serverErrors);
                    toast.error('Terdapat kesalahan pada form');
                    return;
                }

                throw new Error(result.message || 'Terjadi kesalahan');
            }

            toast.success(
                isEditing
                    ? 'Zona banjir berhasil diperbarui'
                    : 'Zona banjir berhasil ditambahkan',
            );

            onOpenChange(false);
            onSuccess?.(result.data);
        } catch (error) {
            console.error('Error submitting zone form:', error);
            const message =
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat menyimpan data';
            setErrors({ general: message });
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="size-5" />
                        {isEditing ? 'Edit Zona Banjir' : 'Tambah Zona Banjir'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Perbarui informasi zona banjir yang sudah ada.'
                            : 'Tambahkan zona banjir baru dengan menentukan area polygon.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="zone-name"
                            className="text-sm leading-none font-medium"
                        >
                            Nama Zona{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="zone-name"
                            type="text"
                            placeholder="Contoh: Zona Banjir Sunter"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                            aria-invalid={!!errors.name}
                            className={cn(errors.name && 'border-destructive')}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="zone-description"
                            className="text-sm leading-none font-medium"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="zone-description"
                            placeholder="Deskripsi zona banjir (opsional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            rows={2}
                            aria-invalid={!!errors.description}
                            className={cn(
                                'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
                                errors.description && 'border-destructive',
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="zone-risk-level"
                            className="text-sm leading-none font-medium"
                        >
                            Tingkat Risiko{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Select
                            value={riskLevel}
                            onValueChange={(value) =>
                                setRiskLevel(value as RiskLevel)
                            }
                            disabled={isSubmitting}
                        >
                            <SelectTrigger
                                id="zone-risk-level"
                                className={cn(
                                    errors.risk_level && 'border-destructive',
                                )}
                            >
                                <SelectValue placeholder="Pilih tingkat risiko" />
                            </SelectTrigger>
                            <SelectContent>
                                {RISK_LEVEL_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.risk_level && (
                            <p className="text-sm text-destructive">
                                {errors.risk_level}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="zone-coordinates"
                            className="text-sm leading-none font-medium"
                        >
                            Koordinat Polygon{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            id="zone-coordinates"
                            placeholder={EXAMPLE_COORDINATES}
                            value={coordinatesText}
                            onChange={(e) => setCoordinatesText(e.target.value)}
                            disabled={isSubmitting}
                            rows={5}
                            aria-invalid={!!errors.coordinates}
                            className={cn(
                                'flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
                                errors.coordinates && 'border-destructive',
                            )}
                        />
                        <p className="text-xs text-muted-foreground">
                            Format: [[lat, lng], [lat, lng], ...] (minimal 3
                            titik)
                        </p>
                        {errors.coordinates && (
                            <p className="text-sm text-destructive">
                                {errors.coordinates}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Zona'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
