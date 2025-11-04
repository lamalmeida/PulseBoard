"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddEndpointForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState("300"); // 5 minutes default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just log the data to console
    console.log("Form submitted:", {
      name,
      url,
      interval: parseInt(interval),
    });

    // TODO: Step 3 will add Supabase insert here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoint Details</CardTitle>
        <CardDescription>
          Add a new endpoint to monitor its health status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name / Label</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., My API, Production Server"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://api.example.com/health"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="interval">Check Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger id="interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">Every 1 minute</SelectItem>
                  <SelectItem value="300">Every 5 minutes</SelectItem>
                  <SelectItem value="900">Every 15 minutes</SelectItem>
                  <SelectItem value="3600">Every 1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Add Endpoint
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}