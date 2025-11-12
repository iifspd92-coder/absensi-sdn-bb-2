import React, { useState, FormEvent, useMemo } from 'react';
import QRCode from 'qrcode.react';
import { UserType, Teacher, Student, Person } from '../types';

interface DataManagementProps<T extends Person> {
    userType: UserType;
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
}

const DataManagement = <T extends Teacher | Student>({ userType, data, setData }: DataManagementProps<T>): React.ReactElement => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [extraField1, setExtraField1] = useState(''); // Position for Teacher, NIS for Student
    const [extraField2, setExtraField2] = useState(userType === UserType.Student ? '1' : ''); // Class for Student
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const isStudent = userType === UserType.Student;
    const formTitle = `👨‍🏫 Data ${userType}`;
    const extraField1Label = isStudent ? 'NIS' : 'Jabatan';
    const extraField2Label = 'Kelas';

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!id.trim() || !name.trim()) {
            setError('ID dan Nama wajib diisi.');
            return;
        }

        if (data.some(item => item.id === id)) {
            setError('ID sudah ada. Gunakan ID lain.');
            return;
        }

        let newUser: T;
        if (isStudent) {
            newUser = { id, name, nis: extraField1, class: extraField2 } as T;
        } else {
            newUser = { id, name, position: extraField1 } as T;
        }

        setData(prevData => [...prevData, newUser]);
        setSuccess(`${userType} ${name} disimpan (ID: ${id}).`);
        
        // Reset form
        setId('');
        setName('');
        setExtraField1('');
        setExtraField2(isStudent ? '1' : '');
    };
    
    const selectedUserData = useMemo(() => {
        if (!selectedUserId) return null;
        return data.find(user => user.id === selectedUserId) || null;
    }, [selectedUserId, data]);

    const handleDownloadQR = () => {
        if (!selectedUserData) return;
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            const prefix = isStudent ? 'SISWA' : 'GURU';
            downloadLink.download = `QR_${prefix}_${selectedUserData.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };
    
    const tableHeaders = isStudent ? ["ID", "Nama", "NIS", "Kelas"] : ["ID", "Nama", "Jabatan"];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{formTitle}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Card */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Tambah {userType} Baru</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID {userType} (unik)</label>
                            <input type="text" value={id} onChange={e => setId(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama {userType}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{extraField1Label}</label>
                            <input type="text" value={extraField1} onChange={e => setExtraField1(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        {isStudent && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{extraField2Label}</label>
                                <select value={extraField2} onChange={e => setExtraField2(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    {['1', '2', '3', '4', '5', '6'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {success && <p className="text-sm text-green-500">{success}</p>}
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Simpan {userType}
                        </button>
                    </form>
                </div>

                {/* Data List and QR Generator Card */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Daftar {userType}</h3>
                     <div className="overflow-x-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{isStudent ? (item as Student).nis : (item as Teacher).position}</td>
                                        {isStudent && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{(item as Student).class}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data.length > 0 && (
                        <div className="mt-6 border-t dark:border-gray-700 pt-6">
                             <h3 className="text-xl font-semibold mb-4">🪪 Buat / Unduh QR {userType}</h3>
                             <div className="flex flex-col sm:flex-row items-center gap-6">
                                 <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih {userType}</label>
                                    <select onChange={e => setSelectedUserId(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                        <option value="">-- Pilih --</option>
                                        {data.map(item => <option key={item.id} value={item.id}>{item.id} - {item.name}</option>)}
                                    </select>
                                 </div>
                                {selectedUserData && (
                                     <div className="text-center">
                                        <div className="p-4 bg-white inline-block rounded-lg">
                                            <QRCode
                                                id="qr-code-canvas"
                                                value={`${isStudent ? 'SISWA' : 'GURU'}-${selectedUserData.id}`}
                                                size={128}
                                                level={"H"}
                                                includeMargin={true}
                                            />
                                        </div>
                                        <p className="text-sm mt-2 font-medium">QR untuk {selectedUserData.name}</p>
                                        <button onClick={handleDownloadQR} className="mt-2 text-sm bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700">
                                            Unduh QR (PNG)
                                        </button>
                                    </div>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataManagement;