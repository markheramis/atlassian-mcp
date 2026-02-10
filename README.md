# Atlassian MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with Atlassian JIRA and Confluence. This server enables AI assistants and other MCP clients to interact with your Atlassian instance through a standardized protocol.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [NPM Installation](#npm-installation)
  - [Manual Installation](#manual-installation)
- [Configuration](#configuration)
  - [Configuration File](#configuration-file)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [With Cline](#with-cline)
  - [With Cursor](#with-cursor)
  - [With Claude Desktop](#with-claude-desktop)
- [Available Tools](#available-tools)
  - [JIRA Tools](#jira-tools)
  - [Confluence Tools](#confluence-tools)
- [MCP Resources](#mcp-resources)
- [Development](#development)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

The Atlassian MCP Server implements the [Model Context Protocol](https://modelcontextprotocol.io/) specification, allowing AI assistants to:

- Manage JIRA tickets (create, update, transition, comment, etc.)
- Work with Confluence pages (create, update, search, etc.)
- Access project metadata and configurations
- Track time with worklogs
- Manage labels, watchers, and attachments

## Features

### JIRA Integration

| Category              | Features                                                                                |
|-----------------------|-----------------------------------------------------------------------------------------|
| Ticket Management     | Create, read, update, delete tickets                                                    |
| Workflow              | Transition tickets through workflow states                                              |
| Comments              | Add, edit, delete comments on tickets                                                   |
| Assignments           | Assign tickets to users                                                                 |
| Time Tracking         | Add, update, delete worklogs                                                            |
| Labels                | Add and remove labels for categorization                                                |
| Watchers              | Add and remove watchers from tickets                                                    |
| Attachments           | Upload file attachments to tickets                                                      |
| Linking               | Link related tickets together                                                           |
| Project Info          | Get projects, components, issue types, priorities, and statuses                         |

### Confluence Integration

| Category              | Features                                                                                |
|-----------------------|-----------------------------------------------------------------------------------------|
| Page Management       | Create, read, update, delete pages                                                      |
| Search                | Search content globally, by space, or by label                                          |
| Comments              | Add, edit, delete comments on pages                                                     |
| Labels                | Add and remove labels from pages                                                        |
| Attachments           | Upload and download attachments                                                         |
| Navigation            | Get page children, ancestors, and history                                               |
| Spaces                | List and get details about Confluence spaces                                            |

## Prerequisites

Before installing the Atlassian MCP Server, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Atlassian Cloud Account** with API access
4. **Atlassian API Token** - Generate one from [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)

## Installation

### NPM Installation

Install the package globally:

```bash
npm install -g atlassian-mcp-server
```

After installation, run the setup wizard:

```bash
atlassian-mcp-setup
```

### Manual Installation

1. Clone the repository:

```bash
git clone https://github.com/kompallik/ATLASSIAN-MCP.git
cd ATLASSIAN-MCP
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run the setup wizard:

```bash
npm run setup
```

## Configuration

The server can be configured using either a configuration file or environment variables.

### Configuration File

Create a `config/config.json` file (or run `npm run setup` to create one interactively):

```json
{
  "atlassian": {
    "baseUrl": "https://your-instance.atlassian.net",
    "email": "your-email@example.com",
    "token": "your-api-token-here"
  },
  "server": {
    "name": "atlassian-server",
    "version": "0.1.0"
  }
}
```

| Property                | Description                                        | Required  |
|-------------------------|----------------------------------------------------|-----------|
| `atlassian.baseUrl`     | Your Atlassian instance URL                        | Yes       |
| `atlassian.email`       | Your Atlassian account email                       | Yes       |
| `atlassian.token`       | Your Atlassian API token                           | Yes       |
| `server.name`           | Name for this MCP server instance                  | No        |
| `server.version`        | Server version                                     | No        |

### Environment Variables

Alternatively, configure the server using environment variables:

| Variable                  | Description                                        |
|---------------------------|----------------------------------------------------|
| `ATLASSIAN_CONFIG_PATH`   | Path to the configuration file                     |
| `ATLASSIAN_BASE_URL`      | Your Atlassian instance URL                        |
| `ATLASSIAN_EMAIL`         | Your Atlassian account email                       |
| `ATLASSIAN_TOKEN`         | Your Atlassian API token                           |
| `SERVER_NAME`             | Name for this MCP server instance                  |
| `SERVER_VERSION`          | Server version                                     |
| `MCP_DEBUG`               | Set to `true` to enable debug logging              |

## Usage

### With Cline

Add the following to your Cline MCP settings:

```json
{
  "mcpServers": {
    "atlassian-server": {
      "command": "atlassian-mcp-server",
      "args": [],
      "env": {
        "ATLASSIAN_CONFIG_PATH": "/path/to/config/config.json"
      },
      "disabled": false
    }
  }
}
```

### With Cursor

Add to your Cursor settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "atlassian-server": {
      "command": "node",
      "args": ["/path/to/mcp-atlassian/build/index.js"],
      "env": {
        "ATLASSIAN_BASE_URL": "https://your-instance.atlassian.net",
        "ATLASSIAN_EMAIL": "your-email@example.com",
        "ATLASSIAN_TOKEN": "your-api-token",
        "SERVER_NAME": "my.atlassian-server",
        "SERVER_VERSION": "0.1.0"
      },
      "disabled": false
    }
  }
}
```

Alternatively, if installed globally via NPM:

```json
{
  "mcpServers": {
    "atlassian-server": {
      "command": "atlassian-mcp-server",
      "args": [],
      "env": {
        "ATLASSIAN_CONFIG_PATH": "/path/to/config/config.json"
      },
      "disabled": false
    }
  }
}
```

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "atlassian-server": {
      "command": "atlassian-mcp-server",
      "env": {
        "ATLASSIAN_BASE_URL": "https://your-instance.atlassian.net",
        "ATLASSIAN_EMAIL": "your-email@example.com",
        "ATLASSIAN_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Available Tools

### JIRA Tools

#### Ticket Operations

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_jira_ticket`                 | Get details of a JIRA ticket by key                        |
| `search_jira_tickets`             | Search for tickets using JQL (JIRA Query Language)         |
| `create_jira_ticket`              | Create a new JIRA ticket                                   |
| `update_jira_ticket`              | Update ticket fields (summary, description, priority)      |
| `delete_jira_ticket`              | Delete a ticket (if permissions allow)                     |
| `transition_jira_ticket`          | Change ticket status through workflow transitions          |
| `get_jira_ticket_transitions`     | Get available status transitions for a ticket              |
| `assign_jira_ticket`              | Assign a ticket to a user                                  |
| `link_jira_tickets`               | Link two tickets together (relates, blocks, duplicates)    |

#### Comments

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_comment_to_jira_ticket`      | Add a comment to a ticket                                  |
| `get_jira_ticket_comments`        | Get all comments on a ticket                               |
| `update_jira_comment`             | Edit an existing comment                                   |
| `delete_jira_comment`             | Delete a comment                                           |

#### Worklogs (Time Tracking)

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_worklog_to_jira_ticket`      | Log time spent on a ticket                                 |
| `get_jira_ticket_worklogs`        | Retrieve all worklog entries                               |
| `update_jira_worklog`             | Modify an existing worklog entry                           |
| `delete_jira_worklog`             | Remove a worklog entry                                     |

#### Labels and Watchers

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_label_to_jira_ticket`        | Add a label to a ticket                                    |
| `remove_label_from_jira_ticket`   | Remove a label from a ticket                               |
| `add_watcher_to_jira_ticket`      | Add a user as a watcher                                    |
| `remove_watcher_from_jira_ticket` | Remove a watcher                                           |
| `get_jira_ticket_watchers`        | List all watchers of a ticket                              |

#### Attachments

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_attachment_to_jira_ticket`   | Upload a file attachment to a ticket                       |

#### Project Information

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_jira_projects`               | List all JIRA projects                                     |
| `get_jira_project`                | Get detailed information about a project                   |
| `get_jira_components`             | Get all components for a project                           |
| `get_jira_issue_types`            | Get available issue types                                  |
| `get_jira_priorities`             | Get all priority options                                   |
| `get_jira_statuses`               | Get all available statuses for a project                   |

### Confluence Tools

#### Page Operations

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_confluence_page`             | Get a page by ID                                           |
| `create_confluence_page`          | Create a new page                                          |
| `update_confluence_page`          | Update an existing page                                    |
| `delete_confluence_page`          | Delete a page                                              |

#### Search

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `search_confluence`               | Search for content globally                                |
| `search_confluence_by_space`      | Search within a specific space                             |
| `search_confluence_by_label`      | Search for pages by label                                  |

#### Comments

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_comment_to_confluence_page`  | Add a comment to a page                                    |
| `get_confluence_page_comments`    | Get all comments on a page                                 |
| `update_confluence_comment`       | Edit an existing comment                                   |
| `delete_confluence_comment`       | Delete a comment                                           |

#### Labels

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `add_label_to_confluence_page`    | Add a label to a page                                      |
| `remove_label_from_confluence_page` | Remove a label from a page                               |
| `get_confluence_page_labels`      | Get all labels on a page                                   |

#### Attachments

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_confluence_page_attachments` | List all attachments on a page                             |
| `upload_attachment_to_confluence_page` | Upload a file attachment                              |
| `download_confluence_attachment`  | Get download URL and metadata                              |

#### Navigation and Hierarchy

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_confluence_page_children`    | Get child pages (sub-pages)                                |
| `get_confluence_page_ancestors`   | Get parent pages (ancestors)                               |
| `get_confluence_page_history`     | Get version history                                        |

#### Spaces

| Tool                              | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `get_confluence_spaces`           | List all Confluence spaces                                 |
| `get_confluence_space`            | Get detailed space information                             |
| `get_confluence_space_content`    | List all pages within a space                              |

## MCP Resources

The server exposes Atlassian content as MCP resources:

| URI Pattern               | Description                                                    |
|---------------------------|----------------------------------------------------------------|
| `jira://ticket/{key}`     | Access JIRA tickets (e.g., `jira://ticket/PROJ-123`)           |
| `confluence://spaces`     | List of available Confluence spaces                            |
| `confluence://page/{id}`  | Access Confluence pages by ID                                  |

Resources are automatically listed with recent JIRA tickets (updated in the last 30 days).

## Development

### Project Structure

```
mcp-atlassian/
├── src/
│   ├── index.ts              # Server entry point
│   ├── config.ts             # Configuration management
│   ├── api-client.ts         # Axios client setup
│   ├── types/
│   │   └── tools.ts          # TypeScript type definitions
│   ├── handlers/
│   │   ├── resources.ts      # MCP resource handlers
│   │   ├── tools.ts          # Tool definitions
│   │   └── tool-executor.ts  # Tool execution router
│   ├── jira/
│   │   ├── index.ts          # JIRA tool registry
│   │   └── tools/            # Individual JIRA tool implementations
│   ├── confluence/
│   │   ├── index.ts          # Confluence tool registry
│   │   └── tools/            # Individual Confluence tool implementations
│   └── utils/
│       ├── adf.ts            # Atlassian Document Format utilities
│       ├── cache.ts          # Caching utilities
│       ├── cql.ts            # Confluence Query Language utilities
│       ├── jql-validator.ts  # JQL validation
│       ├── response.ts       # Response formatting
│       ├── user-lookup.ts    # User lookup utilities
│       └── validation.ts     # Input validation
├── build/                    # Compiled JavaScript output
├── config/
│   └── config.sample.json    # Sample configuration file
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Start the built server
npm start
```

### Adding New Tools

1. Create a new file in `src/jira/tools/` or `src/confluence/tools/`
2. Export a handler function that accepts `(args, apiClient)`
3. Register the tool in the respective index file (`src/jira/index.ts` or `src/confluence/index.ts`)
4. Add the tool definition in `src/handlers/tools.ts`

## Debugging

Enable debug mode to see detailed API requests and responses:

```bash
MCP_DEBUG=true atlassian-mcp-server
```

Or set in your MCP client configuration:

```json
{
  "mcpServers": {
    "atlassian-server": {
      "command": "atlassian-mcp-server",
      "env": {
        "MCP_DEBUG": "true",
        "ATLASSIAN_CONFIG_PATH": "/path/to/config.json"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

| Issue                                      | Solution                                                                         |
|--------------------------------------------|----------------------------------------------------------------------------------|
| "Atlassian base URL is required"           | Ensure `baseUrl` is set in config or `ATLASSIAN_BASE_URL` env var                |
| "401 Unauthorized"                         | Check your API token and email are correct                                       |
| "403 Forbidden"                            | Ensure your account has necessary permissions                                    |
| "Config file not found"                    | Run `npm run setup` or set `ATLASSIAN_CONFIG_PATH`                               |
| Connection timeout                         | Check your network connection and Atlassian instance availability                |

### Getting API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a descriptive label
4. Copy the token immediately (it won't be shown again)

### Permissions Required

For full functionality, your Atlassian account needs:

- **JIRA**: Browse projects, create issues, edit issues, manage watchers, add comments
- **Confluence**: View spaces, add pages, add comments, add attachments

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Koundinya Kompalli** - [GitHub](https://github.com/kompallik)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
