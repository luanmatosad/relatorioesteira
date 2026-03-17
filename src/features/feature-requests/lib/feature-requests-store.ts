import { createIdeaSchema, CreateIdeaInput } from "@/features/feature-requests/schemas/feature-requests.schema";
import { featureRequestsDemoData } from "@/features/feature-requests/lib/feature-requests-demo-data";
import {
  FeatureIdea,
  IdeaComment,
  IdeaFilters,
  IdeasResponse,
} from "@/features/feature-requests/types/feature-requests.types";

type FeatureIdeaStore = {
  ideas: FeatureIdea[];
};

declare global {
  var __featureIdeaStore: FeatureIdeaStore | undefined;
}

function getStore() {
  if (!globalThis.__featureIdeaStore) {
    globalThis.__featureIdeaStore = {
      ideas: structuredClone(featureRequestsDemoData),
    };
  }

  return globalThis.__featureIdeaStore;
}

export function listIdeas(filters: IdeaFilters = {}): IdeasResponse {
  const store = getStore();

  const filteredIdeas = store.ideas
    .filter((idea) => matchIdeaFilters(idea, filters))
    .sort((a, b) => sortIdeas(a, b, filters.sort));

  return {
    data: filteredIdeas,
    meta: {
      total: filteredIdeas.length,
      availableCategories: uniqueValues(store.ideas.map((idea) => idea.category)),
      availableStatuses: uniqueValues(store.ideas.map((idea) => idea.status)),
    },
  };
}

export function getIdeaById(id: string) {
  return getStore().ideas.find((idea) => idea.id === id) ?? null;
}

export function createIdea(input: CreateIdeaInput) {
  const parsed = createIdeaSchema.parse(input);
  const store = getStore();
  const now = new Date().toISOString();

  const idea: FeatureIdea = {
    id: `idea-${Math.random().toString(36).slice(2, 10)}`,
    title: parsed.title,
    summary: parsed.summary,
    problem: parsed.problem,
    businessImpact: parsed.businessImpact,
    proposedSolution: parsed.proposedSolution,
    category: parsed.category,
    author: parsed.author,
    status: "new",
    votes: 1,
    watchers: 1,
    createdAt: now,
    updatedAt: now,
    comments: [],
  };

  store.ideas.unshift(idea);

  return idea;
}

export function voteIdea(id: string) {
  const idea = getIdeaById(id);

  if (!idea) {
    return null;
  }

  idea.votes += 1;
  idea.watchers += 1;
  idea.updatedAt = new Date().toISOString();

  return idea;
}

export function addIdeaComment(id: string, comment: Omit<IdeaComment, "id" | "createdAt">) {
  const idea = getIdeaById(id);

  if (!idea) {
    return null;
  }

  idea.comments.push({
    id: `comment-${Math.random().toString(36).slice(2, 10)}`,
    author: comment.author,
    message: comment.message,
    createdAt: new Date().toISOString(),
  });
  idea.updatedAt = new Date().toISOString();

  return idea;
}

function matchIdeaFilters(idea: FeatureIdea, filters: IdeaFilters) {
  const search = filters.search?.trim().toLowerCase();

  if (filters.status && idea.status !== filters.status) {
    return false;
  }

  if (filters.category && idea.category !== filters.category) {
    return false;
  }

  if (
    search &&
    !`${idea.title} ${idea.summary} ${idea.problem} ${idea.category}`
      .toLowerCase()
      .includes(search)
  ) {
    return false;
  }

  return true;
}

function sortIdeas(a: FeatureIdea, b: FeatureIdea, sort: IdeaFilters["sort"] = "votes") {
  switch (sort) {
    case "recent":
      return b.createdAt.localeCompare(a.createdAt);
    case "updated":
      return b.updatedAt.localeCompare(a.updatedAt);
    case "votes":
    default:
      return b.votes - a.votes;
  }
}

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values)).sort();
}
