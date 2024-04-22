'use server'

import Thread from "@lib/models/thread.model";
import User from "@lib/models/user.model"
import { connectToDB } from "@lib/mongoose"
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string

}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params
): Promise<void> {
    try {
        await connectToDB()
        const userUpdate = await User.findOneAndUpdate(
            {
                id: userId
            },
            {
                username: username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );
        console.log('user update successful', userUpdate)

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        console.log('Failed to create/update user : ', error.message)
    }
}

export async function fetchUser(userId: string) {
    try {
        await connectToDB()

        return await User.findOne({ id: userId })
    } catch (error: any) {
        console.log('Failed to fetch user', error.message)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        await connectToDB()

        console.log('fetchUserPosts function running.....')
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate :{
                    path: 'children',
                    model: Thread,
                    populate : {
                        path : 'author',
                        model : User,
                        select : 'name image id'
                    }

                }

            })
            console.log('fetching users Posts functions was succesful' , threads)

            return threads
    } catch (error) {

    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
  }) {
    try {
      connectToDB();
  
      // Calculate the number of users to skip based on the page number and page size.
      const skipAmount = (pageNumber - 1) * pageSize;
  
      // Create a case-insensitive regular expression for the provided search string.
      const regex = new RegExp(searchString, "i");
  
      // Create an initial query object to filter users.
      const query: FilterQuery<typeof User> = {
        id: { $ne: userId }, // Exclude the current user from the results.
      };
  
      // If the search string is not empty, add the $or operator to match either username or name fields.
      if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ];
      }
  
      // Define the sort options for the fetched users based on createdAt field and provided sort order.
      const sortOptions = { createdAt: sortBy };
  
      const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
  
      // Count the total number of users that match the search criteria (without pagination).
      const totalUsersCount = await User.countDocuments(query);
  
      const users = await usersQuery.exec();
  
      // Check if there are more users beyond the current page.
      const isNext = totalUsersCount > skipAmount + users.length;
  
      return { users, isNext };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  