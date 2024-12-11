import grpc, { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import container from "../../core/container";

type GetRequest = {
	appId: string,
	env: string,
	version: string,
	key: string
}

type GetResponse = {
	value: string | undefined
}

type GetManyRequest = {
	appId: string,
	env: string,
	version: string,
	keys: string[]
}

type GetManyResponse = {
	values: {
		[key: string]:  string
	}
}

export async function getHandler(
  call: ServerUnaryCall<GetRequest, GetResponse>,
  callback: sendUnaryData<GetResponse>
) {
	try {
		const { appId, env, version, key } = call.request;
		const value = await container.cradle.configService.get({ appId, env, version, key });
		callback(null, { value: JSON.stringify(value) });
	} catch (error) {
		// todo: log
		callback({
			code: grpc.status.INTERNAL,
			message: 'An internal error occurred.',
		});
	}
};

export const getManyHandler = async (
  call: ServerUnaryCall<GetManyRequest, GetManyResponse>,
  callback: sendUnaryData<GetManyResponse>
) => {
	try {
		const { appId, env, version, keys } = call.request;
		const values = await container.cradle.configService.getMany({ appId, env, version, keys });
		const stringifiedValues = Object.keys(values).reduce<{ [k: string ]: string }>((obj, key) => {
			obj[key] = JSON.stringify(values[key]);
			return obj;
		}, {});
		
		callback(null, { values: stringifiedValues });
	} catch (error) {
		// todo: log
		callback({
			code: grpc.status.INTERNAL,
			message: 'An internal error occurred.',
		});
	}
};
