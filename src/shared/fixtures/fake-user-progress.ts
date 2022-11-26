import {
  DEFAULT_COUNT_OF_USER_PROGRESS,
  DEFAULT_TOTAL_OF_USER_PROGRESS,
  UserProgressValue,
} from '../constants';

export const fakeUserProgressValue = (
  params: Partial<UserProgressValue> = {},
): UserProgressValue => {
  return {
    count: DEFAULT_COUNT_OF_USER_PROGRESS,
    total: DEFAULT_TOTAL_OF_USER_PROGRESS,
    ...params,
  };
};
