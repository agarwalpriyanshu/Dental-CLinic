import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Data models
export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
}

export interface IncidentFile {
  name: string;
  url: string; // base64 or blob url
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
  nextDate?: string;
  files: IncidentFile[];
}

// Initial data (from requirements)
const initialData = {
  users: [
    { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
    { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' },
  ],
  patients: [
    {
      id: 'p1',
      name: 'John Doe',
      dob: '1990-05-10',
      contact: '1234567890',
      healthInfo: 'No allergies',
    },
  ],
  incidents: [
    {
      id: 'i1',
      patientId: 'p1',
      title: 'Toothache',
      description: 'Upper molar pain',
      comments: 'Sensitive to cold',
      appointmentDate: '2025-07-01T10:00:00',
      cost: 80,
      status: 'Completed',
      files: [
        { name: 'invoice.pdf', url: 'base64string-or-blob-url' },
        { name: 'xray.png', url: 'base64string-or-blob-url' },
      ],
    },
  ],
};

// Context types
interface DataContextType {
  users: User[];
  patients: Patient[];
  incidents: Incident[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (incident: Incident) => void;
  deleteIncident: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Helper to seed or get data
  const getSeeded = (key: string, seed: any) => {
    const val = localStorage.getItem(key);
    if (!val || val === '[]') {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(val);
  };

  // State
  const [users, setUsers] = useState<User[]>(() => getSeeded('users', initialData.users));
  const [patients, setPatients] = useState<Patient[]>(() => getSeeded('patients', initialData.patients));
  const [incidents, setIncidents] = useState<Incident[]>(() => getSeeded('incidents', initialData.incidents));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Auth
  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Patients CRUD
  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };
  const updatePatient = (patient: Patient) => {
    setPatients(prev => prev.map(p => (p.id === patient.id ? patient : p)));
  };
  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setIncidents(prev => prev.filter(i => i.patientId !== id)); // Remove related incidents
  };

  // Incidents CRUD
  const addIncident = (incident: Incident) => {
    setIncidents(prev => [...prev, incident]);
  };
  const updateIncident = (incident: Incident) => {
    setIncidents(prev => prev.map(i => (i.id === incident.id ? incident : i)));
  };
  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        users,
        patients,
        incidents,
        currentUser,
        login,
        logout,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}; 