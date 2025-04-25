
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock departments data
const initialDepartments = [
  { id: 1, name: "Registry", location: "Main Building, Ground Floor", description: "Handles all file registrations and tracking" },
  { id: 2, name: "CEO Office", location: "Main Building, 5th Floor", description: "Executive management and decision making" },
  { id: 3, name: "Finance", location: "Finance Building, 2nd Floor", description: "Handles all financial matters" },
  { id: 4, name: "Human Resources", location: "Admin Building, 1st Floor", description: "Manages staff recruitment and welfare" },
  { id: 5, name: "IT Department", location: "Tech Building, 3rd Floor", description: "Manages technology and systems" },
  { id: 6, name: "Marketing", location: "Marketing Wing, 2nd Floor", description: "Handles promotions and public relations" }
];

const AdminDepartments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    location: "",
    description: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddDepartment = () => {
    const id = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const department = { id, ...newDepartment };
    setDepartments([...departments, department]);
    setNewDepartment({ name: "", location: "", description: "" });
    setIsAddDialogOpen(false);
    toast.success("Department added successfully");
  };
  
  const handleEditClick = (department: any) => {
    setCurrentDepartment(department);
    setNewDepartment(department);
    setIsEditDialogOpen(true);
  };
  
  const handleEditDepartment = () => {
    setDepartments(departments.map(dept => 
      dept.id === currentDepartment.id ? { ...dept, ...newDepartment } : dept
    ));
    setIsEditDialogOpen(false);
    setCurrentDepartment(null);
    toast.success("Department updated successfully");
  };
  
  const handleDeleteClick = (department: any) => {
    setCurrentDepartment(department);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteDepartment = () => {
    setDepartments(departments.filter(dept => dept.id !== currentDepartment.id));
    setIsDeleteDialogOpen(false);
    setCurrentDepartment(null);
    toast.success("Department deleted successfully");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Departments</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add Department</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newDepartment.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter department name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={newDepartment.location} 
                    onChange={handleInputChange} 
                    placeholder="Enter department location" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    value={newDepartment.description} 
                    onChange={handleInputChange} 
                    placeholder="Enter department description" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDepartment}>Add Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map(department => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.location}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(department)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(department)}>
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
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={newDepartment.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input 
                id="edit-location" 
                name="location" 
                value={newDepartment.location} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                name="description" 
                value={newDepartment.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the department "{currentDepartment?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>Delete Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDepartments;
