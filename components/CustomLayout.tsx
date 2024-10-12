"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AppContext from "./ContextProvider";

type DashboardProps = {
    children: React.ReactNode;
    cookieData: any;
}

export default function DashboardLayout({ children, cookieData }: DashboardProps) {
    const router = useRouter()
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)
    const [isDesktopView, setIsDesktopView] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<{menu: number, tab: string}>({menu:0, tab:""})
    const [userCookieData, setUserCookieData] = useState<any>()

    // function handleActiveTab(menu: number, tab: string) {
    //     setActiveTab({...activeTab, menu: menu, tab: tab})
    // }

    // function checkMobileDevice() {
    //     const userAgent = navigator.userAgent || navigator.vendor;
    //     return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    // }

    // function handleSideBar() {
    //     // debugger
    //     setIsSideBarOpen((current) => {
    //         return !current
    //     })
    // }

    // function handleResize() {
    //     // debugger
    //     if (window.innerWidth > 1023) {
    //         setIsDesktopView(true)
    //         setIsSideBarOpen(true)
    //         // window.removeEventListener("click", (e) => { handleSideBar() })
    //         return
    //     }
    //     if (window.innerWidth < 1024) {
    //         setIsDesktopView(false)
    //         setIsSideBarOpen(false)
    //         // window.addEventListener("click", (e) => { handleSideBar() })
    //         return
    //     }

    // }

    // useLayoutEffect(() => {
    //     const isMobileDevice = checkMobileDevice()
    //     const windowSize = window.innerWidth

    //     if (isMobileDevice) {
    //         setIsSideBarOpen(false)
    //         setIsLoading(false)
    //         window.addEventListener("click", (e) => { handleSideBar() })
    //         return () => {
    //             window.removeEventListener("click", (e) => { handleSideBar() })
    //         }
    //     }
    //     if (!isMobileDevice) {
    //         setIsDesktopView(true)
    //         setIsSideBarOpen(true)
    //         window.addEventListener("resize", () => { handleResize() })
    //         window.removeEventListener("click", (e) => { handleSideBar() })
    //         setIsLoading(false)
    //         return () => {
    //             window.removeEventListener("click", (e) => { handleSideBar() })
    //             window.removeEventListener("resize", (e) => { handleResize() })
    //         }
    //     }

    // }, [])

    useEffect(()=>{
        console.log("cookie: ", cookieData)
        if(cookieData) {
            setUserCookieData(cookieData)
            setIsLoading(false)
            localStorage.setItem("cookieData", cookieData)
        }
    }, [cookieData])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <AppContext.Provider value={{userCookieData}}>
            <main className={`flex relative  h-screen`}>
                {children}
            </main>
        </AppContext.Provider>
    )
}