import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Plus, ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
import { useData, Incident, Patient } from '@/lib/DataProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';

const emptyIncident: Omit<Incident, 'id'> = {
  patientId: '',
  title: '',
  description: '',
  comments: '',
  appointmentDate: '',
  cost: undefined,
  treatment: '',
  status: 'Scheduled',
  nextDate: '',
  files: [],
};

const AppointmentsPage = () => {
  const { incidents, patients, addIncident, updateIncident, deleteIncident } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIncident, setEditIncident] = useState<Incident | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const filteredAppointments = incidents.filter(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    const patientName = patient ? patient.name : '';
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleRow = (id: string) => {
    setOpenRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'Scheduled': return 'bg-primary text-primary-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Incident, 'id'>>({
    defaultValues: emptyIncident,
  });

  const openAddModal = () => {
    setEditIncident(null);
    reset(emptyIncident);
    setUploadedFiles([]);
    setModalOpen(true);
  };

  const openEditModal = (incident: Incident) => {
    setEditIncident(incident);
    reset({ ...incident });
    setUploadedFiles(incident.files || []);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditIncident(null);
    reset(emptyIncident);
    setUploadedFiles([]);
  };

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    const base64Files = await Promise.all(
      fileArr.map(
        (file) =>
          new Promise<{ name: string; url: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, url: reader.result as string });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
    setUploadedFiles((prev) => [...prev, ...base64Files]);
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const onSubmit = (data: Omit<Incident, 'id'>) => {
    const incidentWithFiles = { ...data, files: uploadedFiles };
    if (editIncident) {
      updateIncident({ ...editIncident, ...incidentWithFiles });
    } else {
      addIncident({ ...incidentWithFiles, id: `i${Date.now()}` });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(id);
    }
  };

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage patient appointments and treatments</p>
          </div>
          <Button className="bg-gradient-primary text-white shadow-hover" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments by patient name or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const patientName = patient ? patient.name : 'Unknown';
                  return (
                    <React.Fragment key={appointment.id}>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger onClick={() => toggleRow(appointment.id)}>
                              {openRows.includes(appointment.id) ?
                                <ChevronDown className="h-4 w-4" /> :
                                <ChevronRight className="h-4 w-4" />
                              }
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientName}`} />
                              <AvatarFallback>{patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{patientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.title}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : ''}</div>
                            <div className="text-sm text-muted-foreground">{appointment.appointmentDate ? appointment.appointmentDate.split('T')[1]?.slice(0,5) : ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{appointment.cost ? `$${appointment.cost}` : '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(appointment)}>Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(appointment.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {openRows.includes(appointment.id) && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/20">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Treatment Details</h4>
                                <p className="text-sm text-muted-foreground mb-2"><strong>Treatment:</strong> {appointment.treatment}</p>
                                <p className="text-sm text-muted-foreground mb-2"><strong>Description:</strong> {appointment.description}</p>
                                <p className="text-sm text-muted-foreground"><strong>Comments:</strong> {appointment.comments}</p>
                                {appointment.nextDate && (
                                  <p className="text-sm text-muted-foreground"><strong>Next Date:</strong> {appointment.nextDate.replace('T', ' ')}</p>
                                )}
                              </div>
                              {appointment.files.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Attached Files</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {appointment.files.map((file, index) => (
                                      <div key={index} className="flex items-center space-x-2 bg-background p-2 rounded border">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{file.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Appointment Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editIncident ? 'Edit Appointment' : 'Schedule Appointment'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Patient</label>
                <select {...register('patientId', { required: 'Patient is required' })} className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-muted dark:text-foreground">
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.patientId && <span className="text-red-500 text-xs">{errors.patientId.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <Input {...register('title', { required: 'Title is required' })} />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Input {...register('description', { required: 'Description is required' })} />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Comments</label>
                <Input {...register('comments')} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Appointment Date & Time</label>
                <Input type="datetime-local" {...register('appointmentDate', { required: 'Date & time required' })} />
                {errors.appointmentDate && <span className="text-red-500 text-xs">{errors.appointmentDate.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Cost</label>
                <Input type="number" step="0.01" {...register('cost')} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Treatment</label>
                <Input {...register('treatment')} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select {...register('status', { required: 'Status is required' })} className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-muted dark:text-foreground">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Attach Files</label>
                <Input type="file" multiple onChange={handleFileChange} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.name} className="flex items-center space-x-2 bg-background p-2 rounded border">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" type="button" onClick={() => removeFile(file.name)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Next Date</label>
                <Input type="datetime-local" {...register('nextDate')} />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-primary text-white">
                  {editIncident ? 'Update' : 'Add'} Appointment
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default AppointmentsPage;