# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Connecting to Notion

This application can display data from a Notion database on the `/notion-table` page. To make it work, you need to provide your Notion API Key and Database ID.

### How to get your Notion credentials:

#### Part 1: Create an Integration & Get API Key

1.  **Go to My Integrations:** Navigate to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
2.  **Create a New Integration:**
    *   Click the **"+ New integration"** button.
    *   Give it a name (e.g., "My App Connector").
    *   Select the associated workspace.
    *   Under "Content Capabilities", make sure to check **"Read content"**.
    *   Click **"Submit"**.
3.  **Copy the API Key:**
    *   On the next screen, under the **"Secrets"** section, you'll find your "Internal Integration Secret".
    *   Click **"Show"** and then **"Copy"**. This key starts with `secret_`. This is your `NOTION_API_KEY`.

#### Part 2: Share Database & Get Database ID

1.  **Open your Database in Notion:** Go to the full-page database you want to connect.
2.  **Share the Database with your Integration:**
    *   Click the **`•••`** menu at the top-right of the database page.
    *   Click **"+ Add connections"**.
    *   Search for and select the integration you just created.
    *   Click **"Confirm"**.
3.  **Copy the Database ID:**
    *   Look at the URL in your browser's address bar. It will look something like this:
        `https://www.notion.so/your-workspace/`**`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`?v=...`
    *   The **Database ID** is the 32-character string between your workspace name and the `?v=...`. Copy this value. This is your `NOTION_DATABASE_ID`.

### Final Step: Add Credentials to the Project

1.  Open the `.env.local` file in the root of this project.
2.  Add the keys you copied:
    ```
    NOTION_API_KEY="paste_your_api_key_here"
    NOTION_DATABASE_ID="paste_your_database_id_here"
    ```
3.  **Restart your development server.** The `/notion-table` page should now fetch and display data from your Notion database.
