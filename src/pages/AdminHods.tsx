
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash, Plus, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock HODs data
const initialHods = [
  { 
    id: 1, 
    name: "Dr. Michael Brown", 
    email: "michael.brown@example.com", 
    department: "Finance",
    contactNumber: "+1234567890",
    officeLocation: "Finance Building, Room 201"
  },
  { 
    id: 2, 
    name: "Prof. Sarah Wilson", 
    email: "sarah.wilson@example.com", 
    department: "HR",
    contactNumber: "+1234567891",
    officeLocation: "Admin Building, Room 105"
  },
  { 
    id: 3, 
    name: "Dr. David Lee", 
    email: "david.lee@example.com", 
    department: "IT",
    contactNumber: "+1234567892",
    officeLocation: "Tech Building, Room 302"
  },
  { 
    id: 4, 
    name: "Mrs. Jessica Taylor", 
    email: "jessica.taylor@example.com", 
    department: "Marketing",
    contactNumber: "+1234567893",
    officeLocation: "Marketing Wing, Room 210"
  },
  { 
    id: 5, 
    name: "Mr. Robert Chen", 
    email: "robert.chen@example.com", 
    department: "Registry",
    contactNumber: "+1234567894",
    officeLocation: "Main Building, Room G10"
  }
];

const AdminHods = () => {
  const { user } = useAuth();
  const [hods, setHods] = useState(initialHods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [currentHod, setCurrentHod] = useState<any>(null);
  const [newHod, setNewHod] = useState({
    name: "",
    email: "",
    department: "",
    contactNumber: "",
    officeLocation: ""
  });
  const [emailContent, setEmailContent] = useState({
    subject: "",
    message: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHod(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailContent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewHod(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddHod = () => {
    const id = hods.length ? Math.max(...hods.map(h => h.id)) + 1 : 1;
    const hod = { id, ...newHod };
    setHods([...hods, hod]);
    setNewHod({ name: "", email: "", department: "", contactNumber: "", officeLocation: "" });
    setIsAddDialogOpen(false);
    toast.success("HOD added successfully");
  };
  
  const handleEditClick = (hod: any) => {
    setCurrentHod(hod);
    setNewHod(hod);
    setIsEditDialogOpen(true);
  };
  
  const handleEditHod = () => {
    setHods(hods.map(h => 
      h.id === currentHod.id ? { ...h, ...newHod } : h
    ));
    setIsEditDialogOpen(false);
    setCurrentHod(null);
    toast.success("HOD updated successfully");
  };
  
  const handleDeleteClick = (hod: any) => {
    setCurrentHod(hod);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteHod = () => {
    setHods(hods.filter(h => h.id !== currentHod.id));
    setIsDeleteDialogOpen(false);
    setCurrentHod(null);
    toast.success("HOD deleted successfully");
  };
  
  const handleEmailClick = (hod: any) => {
    setCurrentHod(hod);
    setEmailContent({
      subject: "",
      message: ""
    });
    setIsEmailDialogOpen(true);
  };
  
  const handleSendEmail = () => {
    // In a real app, you'd send an email to the HOD
    toast.success(`Email sent to ${currentHod.name} at ${currentHod.email}`);
    setIsEmailDialogOpen(false);
    setCurrentHod(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Heads of Departments</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add HOD</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New HOD</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newHod.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter HOD's full name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={newHod.email} 
                    onChange={handleInputChange} 
                    placeholder="Enter email address" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={newHod.department} 
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Registry">Registry</SelectItem>
                      <SelectItem value="CEO Office">CEO Office</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="IT">IT Department</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input 
                    id="contactNumber" 
                    name="contactNumber" 
                    value={newHod.contactNumber} 
                    onChange={handleInputChange} 
                    placeholder="Enter contact number" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location</Label>
                  <Input 
                    id="officeLocation" 
                    name="officeLocation" 
                    value={newHod.officeLocation} 
                    onChange={handleInputChange} 
                    placeholder="Enter office location" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddHod}>Add HOD</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All HODs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Office Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hods.map(hod => (
                  <TableRow key={hod.id}>
                    <TableCell className="font-medium">{hod.name}</TableCell>
                    <TableCell>{hod.email}</TableCell>
                    <TableCell>{hod.department}</TableCell>
                    <TableCell>{hod.contactNumber}</TableCell>
                    <TableCell>{hod.officeLocation}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEmailClick(hod)}>
                          <Mail size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(hod)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(hod)}>
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      
      {/* Edit HOD Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit HOD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={newHod.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                name="email" 
                type="email"
                value={newHod.email} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select 
                value={newHod.department} 
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registry">Registry</SelectItem>
                  <SelectItem value="CEO Office">CEO Office</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="IT">IT Department</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contactNumber">Contact Number</Label>
              <Input 
                id="edit-contactNumber" 
                name="contactNumber" 
                value={newHod.contactNumber} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-officeLocation">Office Location</Label>
              <Input 
                id="edit-officeLocation" 
                name="officeLocation" 
                value={newHod.officeLocation} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditHod}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Email HOD Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email HOD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Send email to: <strong>{currentHod?.name}</strong> ({currentHod?.email})</p>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                value={emailContent.subject} 
                onChange={handleEmailInputChange} 
                placeholder="Enter email subject" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                value={emailContent.message} 
                onChange={handleEmailInputChange} 
                placeholder="Enter your message" 
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete HOD Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete {currentHod?.name} as HOD of {currentHod?.department}? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteHod}>Delete HOD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHods;
