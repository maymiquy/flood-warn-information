'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, TriangleAlert } from 'lucide-react';
import * as React from 'react';

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    itemName?: string;
    onConfirm: () => void | Promise<void>;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    title = 'Hapus Item',
    description,
    itemName,
    onConfirm,
}: DeleteConfirmDialogProps) {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const defaultDescription = itemName
        ? `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
        : 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.';

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <TriangleAlert className="size-5 text-destructive" />
                        </div>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pl-13">
                        {description || defaultDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            'Hapus'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
