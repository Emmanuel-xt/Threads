'use server'

import Thread from "@lib/models/thread.model";
import User from "@lib/models/user.model"
import { connectToDB } from "@lib/mongoose"
import { revalidatePath } from "next/cache";

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