import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
import Listing from '@/components/ui/listing'; // This is the component that handles the overall layout
import { getRoles } from '@/api/roles';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext'; // Assuming UserProvider is not directly used here
import { CanAccess } from "@/guards/AccessControl";
import { PERMISSIONS } from '@/constants/permissions';

interface Role {
    _id: number;
    name: string;
    description: string;
    userCount: number;
    status: string;
    slug: string;
    editable: boolean;
}

const RoleManagement = () => {
    const { user } = useUser();
    const { toast } = useToast();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try { // Added try-catch for API call
                const roleResponse = await getRoles();
                if (roleResponse.statusCode !== 200) {
                    toast({
                        title: "Error fetching roles",
                        description: "Unable to load roles from the server.",
                        variant: "destructive",
                    });
                } else {
                    setRoles(roleResponse.data);
                }
            } catch (error: any) {
                toast({
                    title: "Error fetching roles",
                    description: error.message || "Unable to load roles from the server.",
                    variant: "destructive",
                });
            }
        };
        fetchData();
    }, [toast]); // Added toast to dependency array

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'default';
            case 'Inactive': return 'secondary';
            case 'Pending': return 'destructive'; // Assuming 'Pending' status
            default: return 'secondary';
        }
    };

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-primary/10 transition-colors"
                >
                    Role Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'description',
            header: () => <div>Description</div>, // Description column doesn't need sorting
            cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('description')}</div>,
        },
        {
            accessorKey: 'userCount',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-primary/10 transition-colors"
                >
                    Users
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('userCount')}</div>,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-primary/10 transition-colors"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return (
                    <Badge variant={getStatusColor(status) as any} className="hover:scale-105 transition-transform">
                        {status} {/* Display the actual status string */}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                // Ensure 'editable' property exists, default to true if not present
                const isEditable = row.original.editable ?? true; // Default to true if not specified
                const isSuperAdminUser = user?.role_id?.slug === 'super-admin'; // Use optional chaining for user and role_id
                const isSuperAdminRole = row.original.slug === 'super-admin'; // Check if the role itself is super-admin

                // Logic for canEdit:
                // A role can be edited if:
                // 1. The role's 'editable' flag is true AND
                //    (a) The current user is not a super-admin, OR
                //    (b) The current user *is* a super-admin AND the role is NOT a super-admin role.
                // This prevents super-admins from editing other super-admin roles if 'editable' is false,
                // but allows them to edit non-super-admin roles even if 'editable' is false for those.
                const canEdit = isEditable && (!isSuperAdminRole || (isSuperAdminUser && isSuperAdminRole));

                // Refined canEdit logic to be more explicit and correct based on common permission patterns:
                // A role can be edited if:
                // 1. The role is explicitly marked as editable (row.original.editable is true)
                // OR
                // 2. The current user is a 'super-admin' AND the role being edited is NOT 'super-admin'
                //    (Super-admins can edit other non-super-admin roles even if they're not explicitly 'editable',
                //     but cannot edit the 'super-admin' role itself unless it's explicitly marked editable,
                //     which it usually isn't or shouldn't be).
                const finalCanEdit = row.original.editable || (isSuperAdminUser && row.original.slug !== 'super-admin');


                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:scale-105 transition-all duration-200">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                            <Link to={`/roles/view/${row.original._id}`}>
                                <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                                    View Role
                                </DropdownMenuItem>
                            </Link>
                            {finalCanEdit && !isSuperAdminRole && ( // Use finalCanEdit
                                <CanAccess permission={PERMISSIONS.ROLE.UPDATE}>
                                    <Link to={`/roles/edit/${row.original._id}`}>
                                        <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                                            Edit Role
                                        </DropdownMenuItem>
                                    </Link>
                                </CanAccess>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu >
                );
            },
        }
    ];

    return (
        <Listing
            title="Role Management"
            description="Manage roles and permissions assigned to your users."
            data={roles}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search roles by name or description..."
            addButtonText="Add Role"
            addButtonLink="/roles/create"
            permission={PERMISSIONS.ROLE.CREATE}
        />
    );
};

export default RoleManagement;