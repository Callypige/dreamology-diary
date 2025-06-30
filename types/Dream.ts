export interface Dream {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lucidity: boolean;
  tags: string[];
  intensity: number;
}