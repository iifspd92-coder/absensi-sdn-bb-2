
import React, { useState, useMemo } from 'react';
import { UserType, AttendanceRecord } from '../types';

// Declare global variables for external libraries
declare var XLSX: any;
declare var jspdf: any;

const DataRecap: React.FC<{ teacherAttendance: AttendanceRecord[], studentAttendance: AttendanceRecord[] }> = ({ teacherAttendance, studentAttendance }) => {
    const [recapType, setRecapType] = useState<UserType>(UserType.Teacher);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const isStudent = recapType === UserType.Student;
    
    const formattedDate = useMemo(() => {
        return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    }, [date]);
    
    const filteredData = useMemo(() => {
        const sourceData = isStudent ? studentAttendance : teacherAttendance;
        return sourceData.filter(record => record.date === formattedDate);
    }, [recapType, date, teacherAttendance, studentAttendance, isStudent, formattedDate]);

    const tableHeaders = isStudent
        ? ["ID", "Nama", "NIS", "Kelas", "Jam Masuk", "Jam Keluar", "Tanggal"]
        : ["ID", "Nama", "Jabatan", "Jam Masuk", "Jam Keluar", "Tanggal"];

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap");
        XLSX.writeFile(workbook, `Rekap_${recapType}_${formattedDate}.xlsx`);
    };

    const handleExportPDF = () => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();

        doc.text(`Rekap ${recapType} - ${formattedDate}`, 14, 15);
        
        (doc as any).autoTable({
            head: [tableHeaders],
            body: filteredData.map(row => isStudent 
                ? [row.id, row.name, row.nis, row.class, row.checkInTime, row.checkOutTime, row.date]
                : [row.id, row.name, row.position, row.checkInTime, row.checkOutTime, row.date]
            ),
            startY: 20,
        });

        doc.save(`Rekap_${recapType}_${formattedDate}.pdf`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📊 Rekap & Export</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Tipe</label>
                        <select value={recapType} onChange={e => setRecapType(e.target.value as UserType)} className="mt-1 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value={UserType.Teacher}>Guru</option>
                            <option value={UserType.Student}>Siswa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Tanggal</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-grow"></div>
                    {filteredData.length > 0 && (
                        <div className="flex space-x-2 mt-2 sm:mt-6">
                            <button onClick={handleExportExcel} className="bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700">
                                Unduh Excel
                            </button>
                            <button onClick={handleExportPDF} className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700">
                                Unduh PDF
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.length > 0 ? filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.name}</td>
                                    {isStudent ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(row as any).nis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{(row as any).class}</td>
                                        </>
                                    ) : (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{(row as any).position}</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.checkInTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.checkOutTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.date}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-4">Tidak ada data untuk tanggal ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataRecap;
