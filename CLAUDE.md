# Claude Code Instructions

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
Always remember to use the TaskMaster MCP to get information about tasks. When you're asked for information about a task, search for the specific task using its ID; don't call all tasks, as this consumes too many tokens.
Also, ALWAYS remember, when a task or subtask is finished and verified as complete, mark it as completed in TaskMaster; it's important to keep everything organized. Never call all tasks and subtasks, as this won't work due to limitations. Search for the specific task I asked you to call and call it by its ID.

Always use the @codebase-explorer sub-agent when deploying a task, because you always perform an analysis before deploying a task; now use the sub-agent.

Always use the context7 MCP to get updated documentation on any technology. Use it to have real-time documentation on the technologies you're using and thus maintain best practices.
The backend you'll connect to, which contains the REST API, is located here. Here's the project location: /home/samuel/Desktop/Backend
I don't want you to ever install a CLI