"use client";

import { IProfile, IResMembers, MemberRole } from "@/interfaces";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../ui/user-avatar";

interface IServerMemberProps {
    member: IResMembers & { profile: IProfile };
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const ServerMember = ({ member }: IServerMemberProps) => {
    const router = useRouter();
    const params = useParams();

    const icon = roleIconMap[member.role];

    const handleNavigateMembers = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    return (
        <div>
            <button
                onClick={handleNavigateMembers}
                className={cn(
                    "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                    params?.memberId === member.id &&
                        "bg-zinc-700/20 dark:bg-zinc-700"
                )}
            >
                <UserAvatar
                    className="w-8 h-8 md:h-8 md:w-8"
                    src={member.profile.imageUrl}
                />
                <p
                    className={cn(
                        "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                        params?.channelId === member.id &&
                            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                    )}
                >
                    {member.profile.name}
                </p>
                {icon}
            </button>
        </div>
    );
};

export default ServerMember;
