import React, { useEffect, useState, useCallback } from 'react';
import { Teacher, Student, AttendanceRecord } from '../types';

declare var Html5Qrcode: any;

interface CameraAttendanceProps {
    teachers: Teacher[];
    students: Student[];
    setTeacherAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
    setStudentAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const CameraAttendance: React.FC<CameraAttendanceProps> = ({ teachers, students, setTeacherAttendance, setStudentAttendance }) => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = useCallback((data: string) => {
        const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
        const date = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

        if (data.startsWith("GURU-")) {
            const id = data.split("GURU-")[1];
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                const newRecord: AttendanceRecord = { 
                    id, 
                    name: teacher.name, 
                    position: teacher.position, 
                    checkInTime: time, 
                    checkOutTime: '-', 
                    date 
                };
                setTeacherAttendance(prev => [...prev, newRecord]);
                setMessage({ type: 'success', text: `Absen masuk guru: ${teacher.name} pada ${time}` });
            } else {
                setMessage({ type: 'error', text: `ID guru tidak ditemukan: ${id}` });
            }
        } else if (data.startsWith("SISWA-")) {
            const id = data.split("SISWA-")[1];
            const student = students.find(s => s.id === id);
            if (student) {
                const newRecord: AttendanceRecord = { 
                    id, 
                    name: student.name, 
                    nis: student.nis, 
                    class: student.class, 
                    checkInTime: time, 
                    checkOutTime: '-', 
                    date 
                };
                setStudentAttendance(prev => [...prev, newRecord]);
                setMessage({ type: 'success', text: `Absen masuk siswa: ${student.name} (Kelas ${student.class}) pada ${time}` });
            } else {
                setMessage({ type: 'error', text: `ID siswa tidak ditemukan: ${id}` });
            }
        } else {
            setMessage({ type: 'error', text: `Format QR tidak valid: ${data}` });
        }
    }, [teachers, students, setTeacherAttendance, setStudentAttendance]);

    useEffect(() => {
        let scanner: any;
        if (isScanning) {
            const readerElement = document.getElementById("reader");
            if (!readerElement) return;
            
            scanner = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
                setScanResult(decodedText);
                handleScan(decodedText);
                // Trigger the cleanup by setting scanning to false. The cleanup function will handle stopping the scanner.
                setIsScanning(false);
            };
            const qrCodeErrorCallback = (errorMessage: string) => {
                // This callback can be noisy. It's safe to ignore most messages.
            };

            if (!scanner.isScanning) {
                scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback)
                    .catch((err: any) => {
                        setMessage({ type: 'error', text: `Gagal memulai kamera: ${err}` });
                        setIsScanning(false);
                    });
            }
        }

        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch((err: any) => {
                    console.error("Gagal membersihkan scanner.", err);
                });
            }
        };
    }, [isScanning, handleScan]);
    

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📷 Absensi via Kamera (QR)</h2>
            <p className="text-gray-600 dark:text-gray-400">Arahkan kamera ke QR code. Aplikasi akan mendeteksi QR dan mencatat absen masuk otomatis.</p>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-lg mx-auto">
                <div id="reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
                
                <div className="mt-4 text-center">
                    {!isScanning ? (
                        <button 
                            onClick={() => {
                                setIsScanning(true);
                                setMessage(null);
                                setScanResult(null);
                            }}
                            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Mulai Scan
                        </button>
                    ) : (
                         <button 
                            onClick={() => setIsScanning(false)}
                            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                        >
                            Hentikan Scan
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`mt-4 p-4 rounded-lg text-sm ${
                        message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        message.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                        <p className="font-bold">{message.type === 'success' ? 'Berhasil!' : message.type === 'error' ? 'Error!' : 'Info'}</p>
                        <p>{message.text}</p>
                        {scanResult && <p className="mt-1 text-xs">Data QR: {scanResult}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraAttendance;