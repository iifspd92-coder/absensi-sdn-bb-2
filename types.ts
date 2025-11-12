
export enum UserType {
    Teacher = 'Guru',
    Student = 'Siswa',
}

export interface Person {
    id: string;
    name: string;
}

export interface Teacher extends Person {
    position: string;
}

export interface Student extends Person {
    nis: string;
    class: string;
}

export interface AttendanceRecord {
    id: string;
    name: string;
    checkInTime: string;
    checkOutTime: string;
    date: string;
    // Include other relevant fields from Teacher/Student for recap purposes
    position?: string;
    nis?: string;
    class?: string;
}
