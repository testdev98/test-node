import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, ArrowUpDown } from "lucide-react";
import Listing from "@/components/ui/listing";
import { getUsers } from "@/api/users";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { CanAccess } from "@/guards/AccessControl";
import { PERMISSIONS } from "@/constants/permissions";

// Types based on API response
interface CompanyProfile {
  name: string;
  email: string;
  phone?: string;
}

interface Role {
  _id: string;
  name: string;
  slug: string;
  description: string;
  editable: string;
  permissions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscribeService {
  service_id: string;
  service_name: string;
  environment: string;
  request_limit: number;
  price: number;
}

interface User {
  _id: string; // Changed from number to string to match API
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  status: number;
  role_id: Role | null;
  parent_id: string | null;
  profile_pic: string;
  company_profile: CompanyProfile;
  subscribe_services: SubscribeService[];
  expired_at: string;
  extra_user_limit: number;
  createdAt: string;
  updatedAt: string;
}

const UserList = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [createExtraUser, setExtraUser] = useState(true);

  useEffect(() => {
    if (user.role_id.slug != "super-admin" && user.extra_user_limit == 0 && user.sub_user_count <= user.extra_user_limit) {
      setExtraUser(false);
    }
    const fetchData = async () => {
      const response = await getUsers();
      if (response.statusCode !== 200) {
        toast({
          title: "Error fetching users",
          description: "Unable to load users from the server.",
          variant: "destructive",
        });
        return;
      }
      setUsers(response.data);
    };
    fetchData();
  }, [toast]);

  const getStatusColor = (
    status: number
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 1:
        return "default"; // Active
      case 0:
        return "secondary"; // Inactive
      case 2:
        return "destructive"; // Block
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1:
        return "Active";
      case 0:
        return "Inactive";
      case 2:
        return "Block";
      default:
        return "Unknown";
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {`${row.original.first_name} ${row.original.last_name}`}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const nameA = `${rowA.original.first_name} ${rowA.original.last_name}`;
        const nameB = `${rowB.original.first_name} ${rowB.original.last_name}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role_id.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.role_id ? row.original.role_id.name : "No Role"}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const roleA = rowA.original.role_id?.name ?? "No Role";
        const roleB = rowB.original.role_id?.name ?? "No Role";
        return roleA.localeCompare(roleB);
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as number;
        return (
          <Badge
            variant={getStatusColor(status)}
            className="hover:scale-105 transition-transform"
          >
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expired_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Expire At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("expired_at")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary/10 transition-colors"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("createdAt")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const isEditable = row.original.role_id?.slug !== "super-admin"; // Check for null role_id
        const isSuperAdminUser = user.role_id?.slug === "super-admin"; // Check for null user.role_id
        const canEdit = isEditable || (isSuperAdminUser && !isEditable);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:scale-105 transition-all duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card/95 backdrop-blur-xl border-border/50"
            >
              <Link to={`/users/view/${row.original._id}`}>
                <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                  View User
                </DropdownMenuItem>
              </Link>
              {canEdit && row.original.username != "superAdmin" && (
                <CanAccess permission={PERMISSIONS.USER.UPDATE}>
                  <Link to={`/users/edit/${row.original._id}`}>
                    <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                      Edit User
                    </DropdownMenuItem>
                  </Link>
                </CanAccess>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Listing
      title="User Management"
      description="Manage users and services assigned to your users."
      data={users}
      columns={columns}
      searchKey="username"
      searchPlaceholder="Search users by username..."
      addButtonText="Add User"
      addButtonLink="/users/create"
      permission={PERMISSIONS.USER.CREATE}
      extraCondition={createExtraUser}
    />
  );
};

export default UserList;