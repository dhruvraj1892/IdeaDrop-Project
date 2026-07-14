import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchIdeas } from "#/api/ideas";
import IdeaCard from "#/components/ideaCard";

const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas"],
    queryFn: () => fetchIdeas(),
  });

export const Route = createFileRoute("/ideas/")({
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

function IdeasPage() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions());
  return (
    <div className="p-4">
      <h1 className="text-2l text-black font-bold mb-4">Ideas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <div key={idea._id}>
            <IdeaCard key={idea._id} idea={idea} button={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
