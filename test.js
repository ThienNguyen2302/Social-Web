const { LogsQueryClient, LogsQueryResultStatus } = require("@azure/monitor-query");
const { DefaultAzureCredential } = require("@azure/identity");

// Authenticate using Azure credentials
const credential = new DefaultAzureCredential();
const logsQueryClient = new LogsQueryClient(credential);

// Define your KQL query and workspace ID
const query = `traces | where timestamp > ago(1d) | project message, severityLevel`;
const workspaceId = "9972ae35-bb7f-47f4-9762-63d407a01758"; // Replace with your Application Insights workspace ID

(async () => {
    try {
        // Run the query
        const result = await logsQueryClient.queryWorkspace(workspaceId, query, {
            duration: "PT24H", // Time range for query
        });

        if (result.status === LogsQueryResultStatus.Success) {
            // Process the query results
            const tables = result.tables;
            tables.forEach((table) => {
                console.log("Results from table:", table.name);
                table.rows.forEach((row) => {
                    console.log(row);
                });
            });
        } else {
            console.error("Query failed:", result.error.message);
        }
    } catch (err) {
        console.error("An error occurred:", err);
    }
})();
