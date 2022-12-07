import { PollsVotes } from 'src/polls-votes/polls-votes.model';
import { PollQuantity, PollTimestamp } from 'src/polls/model';

export const setVotesByTimestamp = (
  timestampIdsAndQuantities: Record<PollTimestamp, PollQuantity>,
  selectedAnswers: PollsVotes[],
): Record<PollTimestamp, PollQuantity> => {
  const timestampIdsAndQuantitiesInPoll = { ...timestampIdsAndQuantities };

  for (let index = 0; index < selectedAnswers.length; index++) {
    const item = selectedAnswers[index];

    const currentTimestamp = Number(item.timestamp);
    const currentQuantity = timestampIdsAndQuantitiesInPoll[currentTimestamp];

    timestampIdsAndQuantitiesInPoll[currentTimestamp] = currentQuantity + 1;
  }

  const valuesOfTimestampIdsAndQuantities = Object.values(
    timestampIdsAndQuantitiesInPoll,
  );
  const keysOfTimestampIdsAndQuantities = Object.keys(
    timestampIdsAndQuantitiesInPoll,
  );
  const quantityOfAnswers = valuesOfTimestampIdsAndQuantities.reduce(
    (prev, currentQuantity) => prev + currentQuantity,
    0,
  );

  for (let index = 0; index < keysOfTimestampIdsAndQuantities.length; index++) {
    const key = keysOfTimestampIdsAndQuantities[index];
    const value = timestampIdsAndQuantitiesInPoll[key] / quantityOfAnswers;

    timestampIdsAndQuantitiesInPoll[key] = value ? Math.round(value * 100) : 0;
  }

  return { ...timestampIdsAndQuantitiesInPoll };
};
