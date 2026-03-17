export type IdeaStatus =
  | "new"
  | "under_review"
  | "planned"
  | "in_progress"
  | "released"
  | "not_prioritized";

export type IdeaComment = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

export type FeatureIdea = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  businessImpact: string;
  proposedSolution: string;
  category: string;
  author: string;
  status: IdeaStatus;
  votes: number;
  watchers: number;
  createdAt: string;
  updatedAt: string;
  comments: IdeaComment[];
};

export type IdeaFilters = {
  status?: IdeaStatus | "";
  category?: string;
  search?: string;
  sort?: "recent" | "votes" | "updated";
};

export type IdeasResponse = {
  data: FeatureIdea[];
  meta: {
    total: number;
    availableCategories: string[];
    availableStatuses: IdeaStatus[];
  };
};
