import { EventEmitter } from 'events';

// Define event types
type ConfigUpdateEvent = Array<{
    appId: string;
    env: string;
    version: string;
    config: Record<string, any>;
}>;

export default class ConfigEventEmitter extends EventEmitter {
    static readonly EVENTS = {
        CONFIG_UPDATED: 'configUpdated',
    };

    // Emit an event when configurations are updated
    emitConfigUpdated(event: ConfigUpdateEvent) {
        this.emit(ConfigEventEmitter.EVENTS.CONFIG_UPDATED, event);
    }

    // Subscribe to the config updated event
    onConfigUpdated(listener: (event: ConfigUpdateEvent) => void) {
        this.on(ConfigEventEmitter.EVENTS.CONFIG_UPDATED, listener);
    }
}