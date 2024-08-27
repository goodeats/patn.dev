# One User Approach

Date: 2024-08-27

Status: Accepted

## Context and Problem Statement

This personal website requires authentication for CRUD operations but doesn't need multi-user support.

## Decision Outcome

Implement a single-user system with the following characteristics:

1. One user account for authentication
2. CRUD actions for posts, bookmarks, and admin functions require authentication
3. Remove ability to create new users after the first user is created

### Positive Consequences

* Simplified user management
* Reduced security surface area
* Streamlined authentication process

### Negative Consequences

* Limited flexibility for future multi-user expansion

## Links

* [Authentication in Epic Stack](https://github.com/epicweb-dev/epic-stack/blob/main/docs/authentication.md)