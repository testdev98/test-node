import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';
import { getRoleById } from '@/api/roles';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/pageHeader';
import { CanAccess } from '@/guards/AccessControl';
import { PERMISSIONS } from '@/constants/permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components

interface Permission {
  _id: string;
  name: string;
}

interface CreatedBy {
  first_name: string;
  last_name: string;
  username: string;
}

interface UpdatedBy {
  first_name: string;
  last_name: string;
  username: string;
}

interface Role {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
  created_by?: CreatedBy;
  updated_by?: UpdatedBy;
  editable: boolean; // Changed type to boolean for consistency with other components
}

const RoleView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { toast } = useToast();

  const [role, setRole] = useState<Role | null>(null);

  // Derive access permissions and editable status
  const isSuperAdminUser = user?.role_id?.slug === 'super-admin';
  const isSuperAdminRole = role?.slug === 'super-admin';
  const canEditRole = role?.editable || (isSuperAdminUser && !isSuperAdminRole);


  useEffect(() => {
    const fetchRole = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Role ID is missing.",
          variant: "destructive",
        });
        navigate('/roles'); // Redirect to roles list if ID is missing
        return;
      }
      try {
        const res = await getRoleById(id);
        if (res.statusCode === 200 && res.data) {
          setRole(res.data);
        } else {
          toast({
            title: "Role Not Found",
            description: "The requested role could not be found.",
            variant: "destructive",
          });
          navigate('/roles'); // Redirect if role not found
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to fetch role details.",
          variant: "destructive",
        });
        navigate('/roles'); // Redirect on error
      }
    };
    fetchRole();
  }, [id, navigate, toast]); // Added navigate and toast to dependencies

  // Function to determine badge variant based on role status
  const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'pending': // If 'pending' status is possible
        return 'secondary';
      default:
        return 'secondary'; // Fallback for unknown status
    }
  };

  // Display loading state while role data is being fetched
  if (!role) {
    return (
      <div className="text-center py-20 text-lg font-medium text-muted-foreground">
        Loading role details...
      </div>
    );
  }

  // Group permissions by module for better organization in display
  const groupedPermissions = role.permissions?.reduce((acc, perm) => {
    // Assuming permission object has a 'module' property
    const moduleName = (perm as any).module || "General"; // Using 'General' if module not present
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);


  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="View Role"
        description={`Detailed information and permissions for the role: ${role.name}`}
      />

      {/* Role Details Card */}
      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border/50">
          <CardTitle className="text-2xl font-bold text-primary">
            {role.name}
            <Badge
              variant={statusVariant(role.status)}
              className="ml-3 px-3 py-1 text-sm font-semibold capitalize"
            >
              {role.status}
            </Badge>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
              {canEditRole && (
                <CanAccess permission={PERMISSIONS.ROLE.UPDATE}>
                  <Link to={`/roles/edit/${role._id}`}> {/* Corrected link path from /role to /roles */}
                    <DropdownMenuItem className="hover:bg-primary/10 flex items-center gap-2 cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" /> Edit Role
                    </DropdownMenuItem>
                  </Link>
                </CanAccess>
              )}
              {/* Optional: Add Delete Role option with PERMISSIONS.ROLE.DELETE */}
              {/* <CanAccess permission={PERMISSIONS.ROLE.DELETE}>
                  <DropdownMenuItem className="hover:bg-destructive/10 text-destructive flex items-center gap-2 cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Role
                  </DropdownMenuItem>
              </CanAccess> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
            <p className="text-lg font-semibold text-foreground">{role.description || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
            <p className="text-lg font-semibold text-foreground">
              {new Date(role.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-foreground">
              {new Date(role.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {isSuperAdminUser && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Created By</p>
              <p className="text-lg font-semibold text-foreground">
                {role.created_by ? `${role.created_by.first_name} ${role.created_by.last_name}` : '—'}
              </p>
            </div>
          )}

          {isSuperAdminUser && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated By</p>
              <p className="text-lg font-semibold text-foreground">
                {role.updated_by ? `${role.updated_by.first_name} ${role.updated_by.last_name}` : '—'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Card */}
      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle>Assigned Permissions</CardTitle>
          <CardDescription>A list of all permissions granted to this role, grouped by module.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {role.permissions?.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                <div key={moduleName} className="border p-4 rounded-lg bg-background/50 shadow-inner">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-border/50 capitalize">
                    {moduleName.replace(/_/g, ' ')} Permissions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((perm) => (
                      <Badge key={perm._id} variant="secondary" className="text-sm px-3 py-1.5 capitalize rounded-full shadow-sm hover:scale-[1.02] transition-transform">
                        {perm.name.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-center py-4">{role.slug == 'super-admin' ? "Super Admin has all permisions." : "No permissions assigned to this role."}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        {role.slug != "super-admin" && (
          <CanAccess permission={PERMISSIONS.ROLE.UPDATE}>
            <Button onClick={() => navigate(`/roles/edit/${id}`)}>
              Edit Role
            </Button>
          </CanAccess>
        )}
      </div>
    </div>
  );
};

export default RoleView;