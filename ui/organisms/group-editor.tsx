"use client";

import { useState, useEffect } from "react";
import { GroupConfig } from "@/lib/status-page-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
import { Checkbox } from "@/ui/atoms/checkbox";
import { v4 as uuidv4 } from "uuid";

type Endpoint = {
    id: string;
    name: string;
    url: string;
};

interface GroupEditorProps {
    allEndpoints: Endpoint[];
    initialGroups: GroupConfig[];
    initialSelectedEndpointIds: string[];
    onChange: (data: { endpoint_ids: string[]; groups: GroupConfig[] }) => void;
}

export function GroupEditor({ allEndpoints, initialGroups, initialSelectedEndpointIds, onChange }: GroupEditorProps) {
    const [groups, setGroups] = useState<GroupConfig[]>(initialGroups);
    // Keep track of which endpoints are selected overall.
    const [selectedEndpointIds, setSelectedEndpointIds] = useState<string[]>(initialSelectedEndpointIds);

    // Communicate changes to parent
    useEffect(() => {
        onChange({ endpoint_ids: selectedEndpointIds, groups });
    }, [groups, selectedEndpointIds]);

    const addGroup = () => {
        setGroups([...groups, { id: uuidv4(), name: "New Group", endpoint_ids: [] }]);
    };

    const removeGroup = (groupId: string) => {
        setGroups(groups.filter(g => g.id !== groupId));
    };

    const updateGroupName = (groupId: string, name: string) => {
        setGroups(groups.map(g => g.id === groupId ? { ...g, name } : g));
    };

    const toggleEndpointSelection = (endpointId: string) => {
        if (selectedEndpointIds.includes(endpointId)) {
            // Deselect: remove from selectedIds AND remove from any group
            setSelectedEndpointIds(ids => ids.filter(id => id !== endpointId));
            setGroups(groups.map(g => ({
                ...g,
                endpoint_ids: g.endpoint_ids.filter(id => id !== endpointId)
            })));
        } else {
            // Select: add to selectedIds (initially ungrouped)
            setSelectedEndpointIds(ids => [...ids, endpointId]);
        }
    };

    const setEndpointGroup = (endpointId: string, groupId: string | null) => {
        if (!groups.find(g => g.id === groupId) && groupId !== null) return;

        // Remove from all groups
        const cleanGroups = groups.map(g => ({
            ...g,
            endpoint_ids: g.endpoint_ids.filter(id => id !== endpointId)
        }));

        if (groupId) {
            // Add to new group
            setGroups(cleanGroups.map(g => g.id === groupId ? { ...g, endpoint_ids: [...g.endpoint_ids, endpointId] } : g));
        } else {
            // Just ungrouped (already removed from groups above)
            setGroups(cleanGroups);
        }
    };

    // Calculate ungrouped endpoints that are currently selected
    const groupedEndpointIds = new Set(groups.flatMap(g => g.endpoint_ids));
    const ungroupedSelectedEndpoints = allEndpoints.filter(e => selectedEndpointIds.includes(e.id) && !groupedEndpointIds.has(e.id));

    // Sort endpoints for list
    const sortedEndpoints = [...allEndpoints].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Endpoint Organization</h3>
                <Button type="button" variant="outline" size="sm" onClick={addGroup} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Group
                </Button>
            </div>

            <div className="space-y-4">
                {/* Render Groups */}
                {groups.map(group => (
                    <Card key={group.id} className="border-dashed bg-muted/30">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center gap-4 space-y-0">
                            <div className="flex-1">
                                <Input
                                    value={group.name}
                                    onChange={(e) => updateGroupName(group.id, e.target.value)}
                                    className="h-8 font-medium bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeGroup(group.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="space-y-2">
                                {allEndpoints
                                    .filter(e => group.endpoint_ids.includes(e.id))
                                    .map(e => (
                                        <div key={e.id} className="flex items-center justify-between p-2 rounded-md bg-background border text-sm">
                                            <span className="flex-1 truncate">{e.name}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-muted-foreground"
                                                onClick={() => setEndpointGroup(e.id, null)} // Move to ungrouped
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))
                                }
                                {group.endpoint_ids.length === 0 && (
                                    <div className="text-xs text-muted-foreground text-center py-2 italic">
                                        No endpoints in group
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Ungrouped Endpoints (Active Pool) */}
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Ungrouped / Available</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-2">
                        {ungroupedSelectedEndpoints.length === 0 && selectedEndpointIds.length > 0 && (
                            <p className="text-sm text-muted-foreground italic">All selected endpoints are assigned to groups.</p>
                        )}

                        {ungroupedSelectedEndpoints.map(e => (
                            <div key={e.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border text-sm group">
                                <div className="flex items-center gap-3">
                                    <span>{e.name}</span>
                                </div>
                                {groups.length > 0 && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] text-muted-foreground mr-1">Move to:</span>
                                        <div className="flex gap-1">
                                            {groups.map(g => (
                                                <Button
                                                    key={g.id}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px]"
                                                    onClick={() => setEndpointGroup(e.id, g.id)}
                                                >
                                                    {g.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Select Endpoints to Monitor</h4>
                    <div className="grid gap-2 max-h-48 overflow-y-auto p-1">
                        {sortedEndpoints.map(endpoint => (
                            <div key={endpoint.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`endpoint-${endpoint.id}`}
                                    checked={selectedEndpointIds.includes(endpoint.id)}
                                    // Use onCheckedChange appropriately
                                    onCheckedChange={(checked) => toggleEndpointSelection(endpoint.id)}
                                />
                                <Label htmlFor={`endpoint-${endpoint.id}`} className="cursor-pointer flex-1">
                                    {endpoint.name} <span className="text-muted-foreground text-xs">({endpoint.url})</span>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
