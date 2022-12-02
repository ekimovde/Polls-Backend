import {
  PollQuantity,
  PollQuestionAnswer,
  PollTimestamp,
} from 'src/polls/model';

export const timestampIdsAndQuantitiesInPoll = (
  answers: PollQuestionAnswer[],
): Record<PollTimestamp, PollQuantity> => {
  return answers.reduce((prev, currentAnswer) => {
    const acc = { ...prev };

    acc[currentAnswer.timestamp] = 0;
    return acc;
  }, {});
};
