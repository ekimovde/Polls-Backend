import { ApiWrapper } from '../constants';

export function getResponseForm<Type>(response: Type): ApiWrapper<Type> {
  return {
    status: 'Ok',
    description: 'Success',
    response,
  };
}
