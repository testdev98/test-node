import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Reusable FormField Component
interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    value,
    onChange,
    type = "text",
    required,
    placeholder,
    error,
    disabled = false,
}) => (
    <div>
        <Label htmlFor={id} className="text-sm font-medium">
            {label} {required && <span className="text-red-600">*</span>}
        </Label>
        <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full mt-1"
            disabled={disabled}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

export default FormField;