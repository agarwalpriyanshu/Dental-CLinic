import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Calendar, Mail, Eye } from 'lucide-react';
import { useData, Patient } from '@/lib/DataProvider';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';

const emptyPatient = {
  id: '',
  name: '',
  dob: '',
  contact: '',
  healthInfo: '',
};

const PatientsPage = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Patient>({
    defaultValues: emptyPatient,
  });

  const openAddModal = () => {
    setEditPatient(null);
    reset(emptyPatient);
    setModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditPatient(patient);
    reset(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditPatient(null);
    reset(emptyPatient);
  };

  const onSubmit = (data: Patient) => {
    if (editPatient) {
      updatePatient({ ...editPatient, ...data });
    } else {
      addPatient({ ...data, id: `p${Date.now()}` });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(id);
    }
  };

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground">Manage patient records and information</p>
          </div>
          <Button className="bg-gradient-primary text-white shadow-hover" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="shadow-card hover:shadow-hover transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(patient)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewPatient(patient)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{patient.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>DOB: {patient.dob}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Health: {patient.healthInfo}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Patient Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input {...register('name', { required: 'Name is required' })} />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Date of Birth</label>
                <Input type="date" {...register('dob', { required: 'DOB is required' })} />
                {errors.dob && <span className="text-red-500 text-xs">{errors.dob.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Contact Info</label>
                <Input {...register('contact', { required: 'Contact is required' })} />
                {errors.contact && <span className="text-red-500 text-xs">{errors.contact.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Health Info</label>
                <Input {...register('healthInfo', { required: 'Health info is required' })} />
                {errors.healthInfo && <span className="text-red-500 text-xs">{errors.healthInfo.message}</span>}
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-primary text-white">
                  {editPatient ? 'Update' : 'Add'} Patient
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Patient Dialog */}
        <Dialog open={!!viewPatient} onOpenChange={() => setViewPatient(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            {viewPatient && (
              <div className="space-y-3">
                <div><strong>Name:</strong> {viewPatient.name}</div>
                <div><strong>Date of Birth:</strong> {viewPatient.dob}</div>
                <div><strong>Contact:</strong> {viewPatient.contact}</div>
                <div><strong>Health Info:</strong> {viewPatient.healthInfo}</div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setViewPatient(null)}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default PatientsPage;