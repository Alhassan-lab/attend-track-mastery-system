
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock data for demonstration
const mockFiles = [
  {
    id: "FILE-001",
    title: "Annual Budget Proposal",
    currentLocation: "CEO Office",
    status: "Pending Review",
    dateUpdated: "2023-04-20T09:30:00",
    priority: "High"
  },
  {
    id: "FILE-002",
    title: "Staff Recruitment Plan",
    currentLocation: "HR Department",
    status: "In Process",
    dateUpdated: "2023-04-19T14:15:00",
    priority: "Medium"
  },
  {
    id: "FILE-003",
    title: "Q1 Financial Report",
    currentLocation: "Finance Department",
    status: "Approved",
    dateUpdated: "2023-04-18T11:45:00",
    priority: "Low"
  },
  {
    id: "FILE-004",
    title: "IT Infrastructure Upgrade",
    currentLocation: "IT Department",
    status: "Awaiting Input",
    dateUpdated: "2023-04-17T16:20:00",
    priority: "Medium"
  },
  {
    id: "FILE-005",
    title: "Marketing Campaign Proposal",
    currentLocation: "Registry",
    status: "New",
    dateUpdated: "2023-04-20T08:00:00",
    priority: "High"
  }
];

export const FileOverview = () => {
  const [files, setFiles] = useState(mockFiles);
  
  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "pending review":
        return "bg-yellow-500";
      case "in process":
        return "bg-blue-500";
      case "new":
        return "bg-purple-500";
      case "awaiting input":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Get priority badge style
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Active Files</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.id}</TableCell>
                  <TableCell>{file.title}</TableCell>
                  <TableCell>{file.currentLocation}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(file.dateUpdated)}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(file.priority)}`}>
                      {file.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/files/${file.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <FileUp size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
