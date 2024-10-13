'use client'
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import NavItems from "../Utils/NavItems";
import { ThemeSwtitcher } from "../Utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
}

const Header: FC<Props> = ({ open, setOpen, activeItem }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClose = (e: any) => {
        if (e.target.id === "screen") {
            setOpen(false);
        }
    }

    return (
        <div className='w-full relative'>
            <div className={`${active ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80px] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500" : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80px] dark:shadow"}`}>
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div>
                            <Link href="/" className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                                EduFlow
                            </Link>
                        </div>
                        <div className='flex items-center'>
                            <NavItems
                                activeItem={activeItem}
                                isMobile={false} />
                            <ThemeSwtitcher />
                            {/* this is only for mobile */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className="cursor-pointer dark:text-white text-black"
                                    onClick={() => setOpen(true)} />
                            </div>
                            <HiOutlineUserCircle
                                size={25}
                                className="hideen 800px:block cursor-pointer dark:text-white text-black ml-4"
                                onClick={() => setOpen(true)} />
                        </div>
                        
                    </div>
                </div>
            </div>
            {/* mobile sidebar */}
            {open && (
                <div
                    className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                    onClick={handleClose}
                    id="screen"
                >
                    <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                        <NavItems
                            activeItem={activeItem}
                            isMobile={true} />
                        <HiOutlineUserCircle
                            size={25}
                            className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                            onClick={() => setOpen(true)} />

                            <br>
                            </br>
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                              Copyright @ 2024 EduFlow
                            </p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Header;
