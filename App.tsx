
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DataManagement from './components/DataManagement';
import CameraAttendance from './components/CameraAttendance';
import ManualAttendance from './components/ManualAttendance';
import DataRecap from './components/DataRecap';
import { Teacher, Student, AttendanceRecord, UserType } from './types';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<string>('Data Guru');

    // Application-wide state
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [teacherAttendance, setTeacherAttendance] = useState<AttendanceRecord[]>([]);
    const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setActiveMenu('Data Guru');
    }, []);

    const renderContent = () => {
        switch (activeMenu) {
            case 'Data Guru':
                return <DataManagement userType={UserType.Teacher} data={teachers} setData={setTeachers} />;
            case 'Data Siswa':
                return <DataManagement userType={UserType.Student} data={students} setData={setStudents} />;
            case 'Absensi':
                return <CameraAttendance teachers={teachers} students={students} setTeacherAttendance={setTeacherAttendance} setStudentAttendance={setStudentAttendance} />;
            case 'Absensi Manual':
                return <ManualAttendance teachers={teachers} students={students} setTeacherAttendance={setTeacherAttendance} setStudentAttendance={setStudentAttendance} />;
            case 'Rekap Data':
                return <DataRecap teacherAttendance={teacherAttendance} studentAttendance={studentAttendance} />;
            default:
                return <DataManagement userType={UserType.Teacher} data={teachers} setData={setTeachers} />;
        }
    };

    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={handleLogout} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
