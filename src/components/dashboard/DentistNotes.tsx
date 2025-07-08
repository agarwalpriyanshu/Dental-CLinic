import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StickyNote, Save } from 'lucide-react';

export const DentistNotes = () => {
  // Simulate a doctor's quick notes for the day (not persisted)
  const [doctorNotes, setDoctorNotes] = useState('');

  const handleNoteSave = () => {
    // In a real app, this would save notes to a backend or localStorage
    alert('Notes saved! (Not persisted in this demo)');
  };

  return (
    <Card className="dentist-notes-container flex flex-col h-full custom-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <StickyNote className="w-5 h-5 text-blue-600" />
          Dentist's Daily Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="E.g. 'Call John Doe to confirm next appointment.'"
          value={doctorNotes}
          onChange={e => setDoctorNotes(e.target.value)}
          className="flex-1 min-h-[120px] border border-blue-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 notes-textarea"
        />
        <Button
          variant="medical"
          size="sm"
          onClick={handleNoteSave}
          className="w-full mt-2 font-semibold bg-blue-600 hover:bg-blue-700 save-notes-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Note
        </Button>
      </CardContent>
    </Card>
  );
};