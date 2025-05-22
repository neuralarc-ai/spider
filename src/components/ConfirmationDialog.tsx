import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    reason: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    reason
}) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Not a Typical Pitch Deck</AlertDialogTitle>
                    <AlertDialogDescription>
                        This PDF doesn't appear to be a standard pitch deck. 
                        <br /><br />
                        Reason: {reason}
                        <br /><br />
                        Would you still like to proceed with the analysis?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>No, Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Yes, Proceed</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationDialog; 