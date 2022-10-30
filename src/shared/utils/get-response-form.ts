import { ApiResponse, ApiWrapper } from '../constants';

export function getResponseForm<Type>(
  response: Type,
  params: Partial<ApiResponse> = {},
): ApiWrapper<Type> {
  return {
    status: 'Ok',
    description: 'Success',
    response,
    ...params,
  };
}
