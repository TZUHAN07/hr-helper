
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  members: Participant[];
}

export enum AppTab {
  PARTICIPANTS = 'PARTICIPANTS',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}
