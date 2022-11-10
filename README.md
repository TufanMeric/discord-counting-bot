# Discord Counting Bot
This bot is intended for use in a single small server, but it can be used in multiple small servers.
It will **NOT** scale to hundreds of small servers or one big server.

There is probably a lot of unnecessary code in this project, as well as bad/unreadable code, but it works, so I didn't bother fixing it.

## Features
- Supports simple math expressions `+, -, *, /, ^, %`.
- Messages without a valid number or math expression will not ruin the count.
- Messages starting with `--` are ignored.
- A message can start or end with anything, bot will only ever evaluate the very first expression it can find.
    - `Hello World, year 2022, almost 2023` will evaluate to `2022`.
- Takes away message permissions of user in designated counting channel if they ruin the count.
- Sends a message with next number to designated counting channel if a message is deleted there, ensuring no one will be trolled. *This can be improved to only send messages if latest counting message is removed.*
- Reacts with ✅ to successful counting messages
- Reacts with ❌ to wrong counting messages and sets the next number to 1.
- Supports emojis like 1️⃣ so the following message will evaluate to 2 `1️⃣ + 1️⃣`
- Ignores all custom Discord emotes, pings or other things that may unintentionally ruin the count.

## Limitations
- As this project uses regular expressions to find math expressions, parentheses are not supported.
- Floating numbers are supported but since we ignore dots, messages can't contain floats. Bot will see `23.5` as `[23, 5]` and message will evaluate to `23`.

## Configuration
Create a `.env` file with your bot token, bot client id and your Discord id.
```env
# Discord bot token
DISCORD_TOKEN=<your Discord token>
# Discord bot client id
CLIENT_ID=<your Discord client id>
# Discord user ID of super admin (access to all admin commands in any server). Can be empty.
SUPERADMIN_ID=<admin's Discord user id>

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./data.sqlite"
```

## Installation
I would add commands for everything in package.json, but I wasn't even going to open source this so if you're here I believe you can compile and run a simple TypeScript project yourself.

## Commands
Instead of using subcommands like a good bot developer, I opted to name them everything `/counting[...]` so you can just type /co in chat and it will autocomplete all commands.