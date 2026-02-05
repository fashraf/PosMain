import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  mobile: string;
  name: string;
  onMobileChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

export function CustomerForm({
  mobile,
  name,
  onMobileChange,
  onNameChange,
}: CustomerFormProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
        Customer Details
      </h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="mobile" className="text-sm">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => onMobileChange(e.target.value)}
            placeholder="Enter mobile number"
            className="mt-1 h-12"
          />
        </div>
        <div>
          <Label htmlFor="name" className="text-sm">
            Customer Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter customer name"
            className="mt-1 h-12"
          />
        </div>
      </div>
    </div>
  );
}
