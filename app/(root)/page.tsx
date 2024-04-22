// 'use client'

import { currentUser } from "@clerk/nextjs"
import ThreadCard from "@components/cards/ThreadCard"
import { fetchPosts } from "@lib/actions/threads.actions"

 
export default async function Home() {

  const result = await fetchPosts(1 , 30)
  console.log('result' , result)
  const user = await currentUser()
  if(!user) return null

  return (
    <>
      <h1 className="head-text">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {
          result.posts.length === 0 ? (
            <p className="no-result">No Threads Found</p>
          ) : (
            <>
            {
              result.posts.map((post : any) => (
                <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ''}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.comment}

                 />
              ))
            }
            </>
          )
        }
      </section>
    </>
  )
}