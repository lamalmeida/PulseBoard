export type GroupConfig = {
    id: string;
    name: string;
    endpoint_ids: string[];
};

export type StatusPageConfig = {
    groups?: GroupConfig[];
    logoUrl?: string;
};

export type ParseResult = {
    description: string;
    groups: GroupConfig[];
    logoUrl?: string;
};

export const CONFIG_SEPARATOR = "\n\n---CONFIG---\n";

export function parseStatusPageDescription(rawDescription?: string): ParseResult {
    if (!rawDescription) {
        return { description: "", groups: [], logoUrl: undefined };
    }

    const parts = rawDescription.split(CONFIG_SEPARATOR);
    const cleanDescription = parts[0].trim();

    // If no config part, return just description
    if (parts.length < 2) {
        return { description: cleanDescription, groups: [], logoUrl: undefined };
    }

    try {
        const configJson = parts[1].trim();
        const config: StatusPageConfig = JSON.parse(configJson);
        return {
            description: cleanDescription,
            groups: Array.isArray(config.groups) ? config.groups : [],
            logoUrl: config.logoUrl
        };
    } catch (e) {
        console.error("Failed to parse status page config", e);
        return { description: cleanDescription, groups: [], logoUrl: undefined };
    }
}

export function stringifyStatusPageConfig(description: string, groups: GroupConfig[], logoUrl?: string): string {
    const config: StatusPageConfig = {};

    if (groups && groups.length > 0) {
        config.groups = groups;
    }

    if (logoUrl) {
        config.logoUrl = logoUrl;
    }

    if (Object.keys(config).length === 0) {
        return description;
    }

    return `${description.trim()}${CONFIG_SEPARATOR}${JSON.stringify(config, null, 2)}`;
}
