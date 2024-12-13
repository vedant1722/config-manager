import dotenv from "dotenv";
dotenv.config();

import container, { initializeContainer } from "./core/container";
import { initializeServer } from "./grpc/server";

(async function () {
    // register dependencies into container
    await initializeContainer();

    // setup config event listener
    container.cradle.configEventEmitter.onConfigUpdated(
        container.cradle.configService.handleConfigsUpdatedEvent.bind(container.cradle.configService)
    );

    // initialize grpc
    initializeServer(container.cradle.config.port);
})();

process.on('uncaughtException', (err) => {
    // todo: user logger
    console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    // todo: use logger
    console.error('Unhandled Rejection:', reason);
});
