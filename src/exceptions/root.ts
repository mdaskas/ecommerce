
export class HttpException extends Error {
	message: string;
	errorCode: ErrorCode;
	statusCode: number;
	errors: any;

	constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
		super(message);

		this.message = message;
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		this.errors = error;
	}
}

export enum ErrorCode {
	USER_NOT_FOUND = '1001',
	USER_ALREADY_EXISTS = '1002',
	INVALID_PASSWORD = '1003',
	ADDRESS_NOT_FOUND = '1004',
	ADDRESS_DOES_NOT_BELONG = '1005',
	UNPROCESSABLE_ENTITY = '2001',
	INTERNAL_ERROR = '3001',
	UNAUTHORIZED = '4001',
	NOT_FOUND = '4002',
	PRODUCT_NOT_FOUND = '4003',
	ORDER_NOT_FOUND = '4004',
}

