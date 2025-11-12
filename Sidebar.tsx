
import React from 'react';
import { Users, GraduationCap, Camera, FilePen, BookCopy, LogOut } from './Icons';

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    onLogout: () => void;
}

const menuItems = [
    { name: 'Data Guru', icon: Users },
    { name: 'Data Siswa', icon: GraduationCap },
    { name: 'Absensi', icon: Camera },
    { name: 'Absensi Manual', icon: FilePen },
    { name: 'Rekap Data', icon: BookCopy },
];

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, onLogout }) => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
            <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📚 Absensi V5</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveMenu(item.name)}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                                isActive 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="px-4 py-4 border-t dark:border-gray-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
