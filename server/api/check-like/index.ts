// file: server/api/check-like.ts
export default defineEventHandler(async (event) => {
    const { postId, userId } = await readBody(event);
    try {
        const like = await $fetch('http://localhost:8055/items/posts_likes', {
            params: {
                filter: {
                    _and: [
                        {
                            user_id: {
                                _eq: userId
                            }
                        },
                        {
                            post_id: {
                                _eq: postId
                            }
                        }
                    ]
                }
            }
        })
        console.log(postId, userId)
        console.log(like)
        return {
            isLiked: like.data.length > 0
        };
    } catch (error) {
        console.log(error)
    }
});