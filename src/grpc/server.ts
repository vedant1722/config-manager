import path from "path";
import protoLoader from "@grpc/proto-loader"
import { Server, ServerCredentials, loadPackageDefinition } from "@grpc/grpc-js";
import { getHandler, getManyHandler } from "./handlers/configHandlers";

const PROTO_PATH = path.resolve(__dirname, "../../proto/config.proto");

export function initializeServer(port: number) {
	const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	});
	
	const protoDescriptor = loadPackageDefinition(packageDefinition) as any;
	const configService = protoDescriptor.ConfigService;
	
	const server = new Server();
	
	// Add service and handlers
	server.addService(configService.service, {
		Get: getHandler,
		GetMany: getManyHandler,
	});
	
	// Start server
	server.bindAsync(`0.0.0.0:${port}`, ServerCredentials.createInsecure(), (err, port) => {
		if (err) {
			throw new Error(`Failed to start server: ${err.message}`);
		}
		server.start();
	});
}

