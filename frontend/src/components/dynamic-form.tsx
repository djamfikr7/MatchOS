import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Field {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
}

interface Schema {
    fields: Field[];
}

interface DynamicFormProps {
    schema: Schema;
}

export function DynamicFormRenderer({ schema }: DynamicFormProps) {
    const { register, formState: { errors } } = useFormContext();

    if (!schema || !schema.fields) return null;

    return (
        <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold">Category Specific Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schema.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={`dynamic_data.${field.name}`}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id={`dynamic_data.${field.name}`}
                            type={field.type === 'number' ? 'number' : 'text'}
                            placeholder={`Enter ${field.label}`}
                            {...register(`dynamic_data.${field.name}`, {
                                required: field.required ? `${field.label} is required` : false,
                                valueAsNumber: field.type === 'number',
                            })}
                        />
                        {errors.dynamic_data?.[field.name] && (
                            <p className="text-sm text-red-500">
                                {(errors.dynamic_data[field.name] as any)?.message}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
