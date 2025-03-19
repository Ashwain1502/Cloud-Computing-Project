import Docker from "dockerode";
const docker = new Docker();

const TARGET_IMAGE = "code-executor"; // Replace with your image name

export async function getContainerIDs() {
    try {
        // Get all running containers
        const containers = await docker.listContainers();

        // Filter containers by image
        const filteredContainers = containers
            .filter(container => container.Image.includes(TARGET_IMAGE))
            .map(container => container.Id); // Extract only container IDs

        return filteredContainers;
    } catch (error) {
        console.error("Error fetching container IDs:", error.message);
        return [];
    }
}


