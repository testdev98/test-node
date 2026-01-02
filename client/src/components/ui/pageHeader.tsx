import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanAccess } from "@/guards/AccessControl";

interface PageHeaderProps {
  title?: string;
  description?: string;
  addButtonLink?: string;
  addButtonText?: string;
  className?: string;
  permission?: string;
  extraCondition?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Page Title",
  description,
  addButtonLink,
  addButtonText = "Add",
  className = "",
  permission,
  extraCondition,
}) => {
  return (
    <div
      className={`
        relative rounded-lg border border-border
        bg-background
        px-5 py-4
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-3
        ${className}
      `}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />

      {/* Title & description */}
      <div className="pl-3">
        <h2 className="text-lg font-semibold text-foreground leading-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {addButtonLink && extraCondition && (
        <CanAccess permission={permission}>
          <Link to={addButtonLink}>
            <Button
              size="sm"
              className="
                flex items-center gap-2
                shadow-sm
                hover:shadow
              "
            >
              <Plus className="h-4 w-4" />
              {addButtonText}
            </Button>
          </Link>
        </CanAccess>
      )}
    </div>
  );
};

export default PageHeader;