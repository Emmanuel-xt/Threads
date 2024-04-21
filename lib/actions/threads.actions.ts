'use server'

import Thread from "@lib/models/thread.model";
import User from "@lib/models/user.model";
import { connectToDB } from "@lib/mongoose";
import { model } from "mongoose";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}


export async function createThread({ text,
    author,
    communityId,
    path }: Params) {
    try {
        await connectToDB()
        console.log('Creating Thread.....')

        const createdThread = await Thread.create({
            text, author, community: null,
        })

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        console.log('thread created succesfully', createThread)

        revalidatePath(path)

    } catch (error) {
        console.log('Error creating thread', error)
    }
}

// export async function fetchPosts(pageNumber = 1, pageSize = 20) {
//     try {
//         await connectToDB()
//         console.log('fetching Posts.....')

//         const skipAMount = (pageNumber - 1) * pageSize
//         const postsQuery = (await Thread.find({ parentId: { $in: [null, undefined] } }))
//             .sort({ createdAt: 'desc' })
//             .skip(skipAMount)
//             .limit(pageSize)
//             .populate({ path: 'author', model: User })
//             .populate({
//                 path: 'children',
//                 populate: {
//                     path: 'author',
//                     model: User,
//                     select: '_id name parentId image'
//                 }
//             })

//         const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })
//         const posts = await postsQuery.exec()
//         const isNext = totalPostsCount > skipAMount + posts.length

//         return { posts, isNext }
//     } catch (error) {

//     }
// }


export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}


export async function fetchThreadById(id : string){
  
  try {
    await connectToDB()
    console.log(`fetching thread with Id ${id}`)
    const thread = await Thread.findById(id)
    .populate({
      path : 'author',
      model : User,
      select : '_id id name parentId '
    })
    .populate({
      path : 'children',
      populate : [
        {
          path:'author',
          model : User,
          select : '_id id name parentId image'
        },
        {
          path : 'children',
          model: Thread,
          populate:{
            path : 'author',
            model : User,
            select : '_id id name parentId image'
          }
        }
      ]
    }).exec()
    return thread
  } catch (error : any) {
    console.log('error fetching thread' , error.message)
  }
}