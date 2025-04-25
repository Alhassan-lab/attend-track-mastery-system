
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, Clock, User } from "lucide-react";

// Mock data for demonstration
const mockActivities = [
  {
    id: 1,
    fileId: "FILE-001",
    fileName: "Annual Budget Proposal",
    action: "moved",
    from: "Registry",
    to: "CEO Office",
    user: "John Smith",
    timestamp: "2023-04-20T09:30:00"
  },
  {
    id: 2,
    fileId: "FILE-005",
    fileName: "Marketing Campaign Proposal",
    action: "created",
    user: "Emma Johnson",
    timestamp: "2023-04-20T08:00:00"
  },
  {
    id: 3,
    fileId: "FILE-002",
    fileName: "Staff Recruitment Plan",
    action: "updated",
    from: "Registry",
    to: "HR Department",
    user: "Michael Brown",
    timestamp: "2023-04-19T14:15:00"
  },
  {
    id: 4,
    fileId: "FILE-003",
    fileName: "Q1 Financial Report",
    action: "approved",
    user: "Sarah Wilson",
    timestamp: "2023-04-18T11:45:00"
  },
  {
    id: 5,
    fileId: "FILE-004",
    fileName: "IT Infrastructure Upgrade",
    action: "commented",
    user: "David Lee",
    comment: "Waiting for additional budget approval",
    timestamp: "2023-04-17T16:20:00"
  }
];

export const RecentActivity = () => {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get icon for activity type
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "moved":
        return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case "created":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "updated":
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "commented":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get activity description
  const getActivityDescription = (activity: any) => {
    switch (activity.action) {
      case "moved":
        return (
          <span>
            moved <strong>{activity.fileId}</strong> from <strong>{activity.from}</strong> to <strong>{activity.to}</strong>
          </span>
        );
      case "created":
        return (
          <span>
            created a new file <strong>{activity.fileId}</strong>
          </span>
        );
      case "updated":
        return (
          <span>
            updated file <strong>{activity.fileId}</strong>, moved from <strong>{activity.from}</strong> to <strong>{activity.to}</strong>
          </span>
        );
      case "approved":
        return (
          <span>
            approved file <strong>{activity.fileId}</strong>
          </span>
        );
      case "commented":
        return (
          <span>
            commented on <strong>{activity.fileId}</strong>: "{activity.comment}"
          </span>
        );
      default:
        return (
          <span>
            performed an action on <strong>{activity.fileId}</strong>
          </span>
        );
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {mockActivities.map(activity => (
              <div key={activity.id} className="flex gap-4 p-3 border-b border-gray-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <span className="mx-1 text-muted-foreground">{' '}</span>
                    <p className="text-sm text-muted-foreground">
                      {getActivityDescription(activity)}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDate(activity.timestamp)}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium text-gray-700">{activity.fileName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
