"use client";
import { Fragment, useEffect, useState } from "react";
import qs from "query-string";
import { GetServerDetails } from "@/API";
import { redirect, useRouter } from "next/navigation";
import { IMember, IResServerDetails } from "@/interfaces";
import { useData } from "@/components/providers/data-provider";
import { useSocket } from "@/components/providers/socket-provider";
import { useSocketEvents } from "@/components/providers/socket-event-provider";
import { decrypt } from "@/utility/app.utility";

interface IServerDetailPageProps {
    params: {
        serverId: string;
    };
}

const ServerDetailPage = ({ params }: IServerDetailPageProps) => {
    const { socket } = useSocket();
    const { addListener, removeListener } = useSocketEvents();
    const { servers, handleDeleteServer, handleRemoveMemberInServer } =
        useData();
    const router = useRouter();

    const handleUpdateDeletedServer = (data: any) => {
        const encryptedData = JSON.parse(decrypt(data)) as { id: string };
        const server = servers.find((server) => server.id !== encryptedData.id);
        if (server) {
            router.push(`/servers/${server.id}`);
        } else {
            router.push("/");
        }
        handleDeleteServer(encryptedData.id);
    };

    const handleRemoveMember = (data: any) => {
        const encryptedData = JSON.parse(decrypt(data)) as {
            id: string;
            serverId: string;
        };
        handleRemoveMemberInServer({
            serverId: encryptedData.serverId,
            memberId: encryptedData.id,
        });
    };

    useEffect(() => {
        addListener("server:deleted:update", handleUpdateDeletedServer);
        addListener(
            `server:${params.serverId}:member:leave`,
            handleRemoveMember
        );

        return () => {
            removeListener("server:deleted:update", handleUpdateDeletedServer);
        };
    }, []);

    useEffect(() => {
        const server = servers.find((server) => server.id === params.serverId);

        return router.push(
            `/servers/${params.serverId}/channels/${server?.channels[0].id}`
        );
    }, [params.serverId, router, socket]);

    return <Fragment />;
};

export default ServerDetailPage;
