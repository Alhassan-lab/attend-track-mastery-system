
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { 
  FileText, 
  Clock, 
  Calendar, 
  Edit, 
  ArrowRight, 
  UserCircle, 
  MessageSquare,
  Printer,
  Download,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateFileStatusForm } from "@/components/UpdateFileStatusForm";
import { TransferFileForm } from "@/components/TransferFileForm";

// Mock file data for demonstration
const mockFile = {
  id: "FILE-001",
  title: "Annual Budget Proposal",
  description: "Budget proposal for the fiscal year 2023-2024 including departmental allocations and projected expenditures.",
  barcode: "123456789012",
  createdBy: "Emma Johnson",
  createdAt: "2023-04-15T10:15:00",
  currentLocation: "CEO Office",
  status: "Pending Review",
  priority: "High",
  category: "Finance",
  relatedFiles: ["FILE-045", "FILE-032"],
  history: [
    {
      id: 1,
      action: "created",
      user: "Emma Johnson",
      timestamp: "2023-04-15T10:15:00",
      location: "Registry"
    },
    {
      id: 2,
      action: "transferred",
      user: "John Smith",
      timestamp: "2023-04-17T14:20:00",
      from: "Registry",
      to: "Finance Department",
      notes: "For initial review"
    },
    {
      id: 3,
      action: "reviewed",
      user: "Michael Brown",
      timestamp: "2023-04-19T11:30:00",
      location: "Finance Department",
      notes: "Reviewed and approved by Finance Department"
    },
    {
      id: 4,
      action: "transferred",
      user: "Michael Brown",
      timestamp: "2023-04-20T09:30:00",
      from: "Finance Department",
      to: "CEO Office",
      notes: "Forwarded for final approval"
    }
  ],
  comments: [
    {
      id: 1,
      user: "Michael Brown",
      timestamp: "2023-04-19T11:35:00",
      text: "All financial projections look good. Approved from Finance Department."
    },
    {
      id: 2,
      user: "Sarah Wilson",
      timestamp: "2023-04-20T10:15:00",
      text: "Please review section 3.2 regarding capital expenditures."
    }
  ],
  metadata: {
    referenceNumber: "BUD-2023-001",
    department: "Finance",
    fiscalYear: "2023-2024",
    confidentiality: "Medium",
    retentionPeriod: "7 years"
  }
};

const FileDetails = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { user } = useAuth();
  const [file, setFile] = useState(mockFile);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showTransferFile, setShowTransferFile] = useState(false);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{file.title}</h1>
              <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
            </div>
            <p className="text-muted-foreground">File ID: {file.id}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Printer className="mr-1 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowUpdateStatus(true)}>
              <Edit className="mr-1 h-4 w-4" /> Update Status
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowTransferFile(true)}>
              <ArrowRight className="mr-1 h-4 w-4" /> Transfer File
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>File Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{file.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <FileText className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Barcode</p>
                            <p className="text-sm text-muted-foreground">{file.barcode}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <UserCircle className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Created By</p>
                            <p className="text-sm text-muted-foreground">{file.createdBy}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Calendar className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Created Date</p>
                            <p className="text-sm text-muted-foreground">{formatDate(file.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Activity className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Priority</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(file.priority)}`}>
                              {file.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {Object.entries(file.metadata).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>File History</CardTitle>
                    <CardDescription>Complete tracking history of this file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l border-muted">
                      {file.history.map((event, index) => (
                        <div key={event.id} className={`relative pb-6 ${index === file.history.length - 1 ? "" : ""}`}>
                          <div className="absolute -left-[11px] mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Clock className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium capitalize">
                                {event.action}
                                {event.action === "transferred" && (
                                  <span>
                                    {" from "}
                                    <span className="font-semibold">{event.from}</span>
                                    {" to "}
                                    <span className="font-semibold">{event.to}</span>
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">By: {event.user}</p>
                            {event.notes && (
                              <p className="text-sm mt-2 bg-muted p-2 rounded">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                    <CardDescription>Discussion and notes about this file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {file.comments.map(comment => (
                        <div key={comment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <UserCircle className="h-5 w-5 text-primary" />
                              </div>
                              <p className="font-medium">{comment.user}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</p>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          className="w-full bg-muted px-10 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-primary" 
                          placeholder="Add a comment..."
                        />
                        <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 rounded-full">
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="font-semibold text-lg">{file.currentLocation}</p>
                  <p className="text-sm text-muted-foreground mt-1">Since {formatDate(file.history[file.history.length - 1].timestamp)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Related Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {file.relatedFiles.map(relatedFileId => (
                    <div key={relatedFileId} className="flex items-center p-2 rounded hover:bg-muted">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`/files/${relatedFileId}`} className="text-sm hover:underline">{relatedFileId}</a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  {/* This would be a QR code image in real implementation */}
                  <div className="h-32 w-32 bg-gray-200 flex items-center justify-center">
                    <p className="text-xs text-gray-500">QR Code for<br />{file.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Update Status Modal would be here */}
      
      {/* Transfer File Modal would be here */}
    </div>
  );
};

export default FileDetails;
