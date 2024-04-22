import ThreadCard from "@components/cards/ThreadCard";
import { fetchUserPosts } from "@lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const result = await fetchUserPosts(accountId);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread : any) => (
        <ThreadCard
          key={thread?._id}
          id={thread?._id}
          currentUserId={currentUserId}
          parentId={thread?.parentId}
          content={thread?.text}
          author={thread?.author}
          community={thread?.community}
          createdAt={thread?.createdAt}
          comments={thread?.comment}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
