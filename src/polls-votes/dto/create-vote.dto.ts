export class CreateVoteDto {
  readonly pollId: number;

  readonly userId: number;

  readonly text: string;

  readonly timestamp: number;
}
