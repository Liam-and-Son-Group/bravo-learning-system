import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { DataTable } from "@/shared/components/ui/table";
import {
  ShoppingBag,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// Mock data - replace with real API data
const purchaseHistory = [
  {
    id: "1",
    item: "Pro Plan Subscription",
    date: "2024-12-01",
    amount: "$29.99",
    status: "completed",
    invoice: "/invoices/001.pdf",
  },
  {
    id: "2",
    item: "Additional Storage (100GB)",
    date: "2024-11-15",
    amount: "$9.99",
    status: "completed",
    invoice: "/invoices/002.pdf",
  },
  {
    id: "3",
    item: "Pro Plan Subscription",
    date: "2024-11-01",
    amount: "$29.99",
    status: "completed",
    invoice: "/invoices/003.pdf",
  },
  {
    id: "4",
    item: "Team Collaboration Package",
    date: "2024-10-20",
    amount: "$49.99",
    status: "pending",
    invoice: null,
  },
];

const currentSubscriptions = [
  {
    id: "1",
    name: "Pro Plan",
    status: "active",
    renewalDate: "2025-01-01",
    amount: "$29.99/month",
  },
  {
    id: "2",
    name: "Additional Storage",
    status: "active",
    renewalDate: "2025-01-15",
    amount: "$9.99/month",
  },
];

export default function PurchasePage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const purchaseColumns = [
    {
      key: "date" as const,
      header: "Date",
      render: (value: string) =>
        new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "item" as const,
      header: "Item",
      render: (value: string, row: (typeof purchaseHistory)[0]) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "amount" as const,
      header: "Amount",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "invoice" as const,
      header: "Invoice",
      render: (value: string | null) =>
        value ? (
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">Pending</span>
        ),
    },
  ];

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-8 h-8" />
          Purchase History
        </h1>
        <p className="text-muted-foreground mt-1">
          View your purchase history, subscriptions, and download invoices
        </p>
      </div>

      <Separator />

      {/* Current Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>
            Manage your current subscriptions and renewals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{sub.name}</h3>
                    <Badge variant="default" className="bg-green-500">
                      {sub.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Renews on {sub.renewalDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{sub.amount}</span>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Complete history of all your purchases and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={purchaseColumns} data={purchaseHistory} />
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your payment methods and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">
                •••• •••• •••• 4242 (Expires 12/25)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Billing Address</p>
              <p className="text-sm text-muted-foreground">
                123 Main St, City, Country
              </p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
