"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestLeaveServer } from "@/API";
import { Loader2 } from "lucide-react";
interface IILeaveServerModalProps {}

const LeaveServerModal = (props: IILeaveServerModalProps) => {
    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [isLoading, setIsLoading] = useState(false);

    const { serverName, serverId } = data;
    const isModalOpen = isOpen && type === "LeaveServer";

    const onLeaveServer = async () => {
        try {
            setIsLoading(true);

            await RequestLeaveServer(`/servers/${serverId}/leave`);

            onClose();
            router.push("/");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
            {isLoading && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
                    <Loader2 className="text-indigo-600 w-8 h-8  animate-spin" />
                </div>
            )}
            <DialogContent
                className={`bg-white text-black border-0 p-0 overflow-hidden select-none ${
                    isLoading ? "opacity-85" : ""
                }`}
            >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center text-zinc-500">
                    Are you sure you want to leave{" "}
                    <span className="font-semibold text-indigo-500">
                        {serverName}
                    </span>
                    ?
                </DialogDescription>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            onClick={() => onClose()}
                            disabled={isLoading}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onLeaveServer()}
                            disabled={isLoading}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveServerModal;
