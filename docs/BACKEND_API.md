# Backend API Catalog

> **Base URL**: `/service/v1/api` (relative to API host)

This document outlines the available API endpoints provided by the `bravo-learning-service`.

## 🔒 Authentication (`/authentication`)

| Method | Endpoint | Description | Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `{ email, password, name }` | `{ success }` |
| `POST` | `/signin` | Login user | `{ email, password }` | `{ accessToken, refreshToken }` |
| `POST` | `/refresh` | Refresh access token | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `POST` | `/logout` | Logout user | `Header: Bearer Token` | `{ success }` |
| `POST` | `/verify` | Verify token validity | `Header: Bearer Token` | `{ isValid }` |
| `GET` | `/profile` | Get current user profile | `Header: Bearer Token` | `UserProfile` |

## 📚 Lessons (`/lessons`)

### Core Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Create a new lesson |
| `GET` | `/:id` | Get lesson details |
| `GET` | `/?folderId=...` | List lessons (optional folder filter) |
| `DELETE` | `/:id` | Soft delete a lesson |

### Versioning & Authoring
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/:id/versions` | Save a NEW version to a branch |
| `GET` | `/:id/versions/:versionId` | Get specific version details |

### Branching (Working Desks)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:id/branches` | List all branches for lesson |
| `POST` | `/:id/branches` | Create a new branch |
| `GET` | `/:id/branches/:branchId/content` | Get current content of a branch |
| `GET` | `/:id/branches/:branchId/versions` | Get version history of a branch |
| `POST` | `/:id/branches/:sourceId/merge` | Merge feature branch into main |

## 📁 Folders (`/folders`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tree` | Get full folder tree for user |
| `POST` | `/initialize` | Create default folders if missing |
| `POST` | `/` | Create new folder |
| `PATCH` | `/:id` | Update folder name/details |
| `PATCH` | `/:id/move` | Move folder to new parent |
| `DELETE` | `/:id` | Delete empty folder |

## 🏢 Organizations (`/organizations`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Create organization |
| `GET` | `/` | List organizations |
| `GET` | `/:id` | Get organization details |
| `PATCH` | `/:id` | Update organization |
| `DELETE` | `/:id` | Delete organization |
| `POST` | `/:id/members` | Add user to organization |
| `GET` | `/:id/members` | List members |
| `PATCH` | `/:id/members/:userId/roles` | Update member roles |
| `DELETE` | `/:id/members/:userId` | Remove member |

## 📎 File Upload (`/file`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload` | Upload single file (Multipart) |

---
*Generated based on Controller analysis.*
