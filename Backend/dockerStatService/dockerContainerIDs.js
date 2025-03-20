import Docker from "dockerode";
export const containerPortMap = {};

const docker = new Docker();
const TARGET_IMAGE = "code-executor"; // Replace with your image name

export async function getContainerIDandPorts() {
    try {
        // Get all running containers
        const containers = await docker.listContainers();

        for (const container of containers) {
            if (container.Image.includes(TARGET_IMAGE)) {
                const containerId = container.Id;

                // Extract host port from container's port bindings
                const ports = container.Ports;
                const hostPort = ports.length > 0 ? ports[0].PublicPort : null;

                containerPortMap[containerId] = hostPort;
            }
        }

        return containerPortMap;
    } catch (error) {
        console.error("Error fetching container ports:", error.message);
        return {};
    }
}


