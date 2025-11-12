import React, { useState, FormEvent } from 'react';
import { UserType, Teacher, Student, AttendanceRecord } from '../types';

interface ManualAttendanceProps {
    teachers: Teacher[];
    students: Student[];
    setTeacherAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
    setStudentAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const ManualAttendance: React.FC<ManualAttendanceProps> = ({ teachers, students, setTeacherAttendance, setStudentAttendance }) => {
    const [mode, setMode] = useState<UserType>(UserType.Teacher);
    const [useExisting, setUseExisting] = useState(true);
    
    // Form state
    const [selectedId, setSelectedId] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [extraField1, setExtraField1] = useState(''); // Position/NIS
    const [extraField2, setExtraField2] = useState('1'); // Class
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [checkInTime, setCheckInTime] = useState(new Date().toTimeString().slice(0,5));
    const [checkOutTime, setCheckOutTime] = useState('');

    const [message, setMessage] = useState('');

    const isStudent = mode === UserType.Student;
    const dataList = isStudent ? students : teachers;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        let record: AttendanceRecord;
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

        if (useExisting) {
            const selectedPerson = dataList.find(p => p.id === selectedId);
            if (!selectedPerson) {
                setMessage('Pilih data yang valid dari daftar.');
                return;
            }
            record = {
                id: selectedPerson.id,
                name: selectedPerson.name,
                checkInTime: checkInTime || '-',
                checkOutTime: checkOutTime || '-',
                date: formattedDate,
                ...(isStudent ? { nis: (selectedPerson as Student).nis, class: (selectedPerson as Student).class } : { position: (selectedPerson as Teacher).position })
            };
        } else {
             if (!name.trim()) {
                setMessage('Nama wajib diisi untuk data baru.');
                return;
            }
            record = {
                id: id || '-',
                name: name,
                checkInTime: checkInTime || '-',
                checkOutTime: checkOutTime || '-',
                date: formattedDate,
                 ...(isStudent ? { nis: extraField1, class: extraField2 } : { position: extraField1 })
            };
        }
        
        if (isStudent) {
            setStudentAttendance(prev => [...prev, record]);
        } else {
            setTeacherAttendance(prev => [...prev, record]);
        }
        
        setMessage(`Absensi ${mode} untuk ${record.name} berhasil disimpan.`);
        // Reset some fields
        setSelectedId('');
        setId('');
        setName('');
        setExtraField1('');
        setExtraField2('1');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">✍️ Absensi Manual</h2>
            <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                <button onClick={() => setMode(UserType.Teacher)} className={`w-full py-2 rounded-md text-sm font-medium ${mode === UserType.Teacher ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Guru</button>
                <button onClick={() => setMode(UserType.Student)} className={`w-full py-2 rounded-md text-sm font-medium ${mode === UserType.Student ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Siswa</button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Tambah/Mencatat Absen {mode}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <input type="checkbox" id="useExisting" checked={useExisting} onChange={e => setUseExisting(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="useExisting" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Pilih dari daftar {mode} yang sudah ada</label>
                    </div>

                    {useExisting ? (
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih {mode}</label>
                           <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="">-- Pilih --</option>
                                {dataList.map(item => <option key={item.id} value={item.id}>{item.id} - {item.name}</option>)}
                           </select>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border dark:border-gray-700 p-4 rounded-lg">
                            <h4 className="md:col-span-2 text-md font-semibold -mb-2">Data Baru</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID {mode} (opsional)</label>
                                <input type="text" value={id} onChange={e => setId(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama {mode}</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{isStudent ? 'NIS' : 'Jabatan'}</label>
                                <input type="text" value={extraField1} onChange={e => setExtraField1(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                            {isStudent && <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                                 <select value={extraField2} onChange={e => setExtraField2(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    {['1', '2', '3', '4', '5', '6'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jam Masuk</label>
                            <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jam Keluar (opsional)</label>
                            <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                    </div>
                    {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Simpan Absensi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManualAttendance;