import { FloorEntity } from "../floor.entity";

export interface FloorsResponseInterface {
  floors: FloorEntity[],
  floorsCount: number,
}