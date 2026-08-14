import { IoHomeSharp } from "react-icons/io5";
import { HiClipboardList } from "react-icons/hi";
import { LuUsersRound } from "react-icons/lu";
import { TbFileDownloadFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";

export const navbarData = [
    {
        id: 1,
        label: "Home",
        link: '/',
        icon: IoHomeSharp
    },

    {
        id: 2,
        label: "Records",
        link: '/records',
        icon: HiClipboardList
    },

    {
        id: 3,
        label: "Patients",
        link: '/patients',
        icon: LuUsersRound
    },

    {
        id: 4,
        label: "Export",
        link: '/export-data',
        icon: TbFileDownloadFilled
    },

    {
        id: 5,
        label: "Settings",
        link: '/settings',
        icon: IoMdSettings
    },
]