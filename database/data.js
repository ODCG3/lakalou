const db = {
    "users": [
        {
            id: 0,
            name: "Alice",
            email: "alice@example.com",
            posts: [
                {
                    id: 0,
                    img_link: "https://via.placeholder.com/150",
                    title: "Alice's First Post",
                    description: "This is Alice's first post.",
                    comments: [
                        {
                            id: 0,
                            user_id: 1,
                            comment: "Nice post, Alice!"
                        }
                    ],
                    likes: [1, 2],
                    dislikes: [0],
                    views: [0, 1],
                    shares: [
                        {
                            receiver_id: 1,
                            url_post: "http://post1.com"
                        }
                    ],
                    notes: [
                        {
                            user_id: 1,
                            note: 8
                        }
                    ]
                }
            ],
            favorites: [1],
            followers: [1]
        },
        {
            id: 1,
            name: "Bob",
            email: "bob@example.com",
            posts: [
                {
                    id: 1,
                    img_link: "https://via.placeholder.com/150",
                    title: "Bob's First Post",
                    description: "This is Bob's first post.",
                    comments: [
                        {
                            id: 1,
                            user_id: 2,
                            comment: "Great post, Bob!"
                        }
                    ],
                    likes: [0, 2],
                    dislikes: [1],
                    views: [1, 2],
                    shares: [
                        {
                            receiver_id: 2,
                            url_post: "http://post2.com"
                        }
                    ],
                    notes: [
                        {
                            user_id: 2,
                            note: 9
                        }
                    ]
                }
            ],
            favorites: [2],
            followers: [2]
        },
        {
            id: 2,
            name: "Charlie",
            email: "charlie@example.com",
            posts: [
                {
                    id: 2,
                    img_link: "https://via.placeholder.com/150",
                    title: "Charlie's First Post",
                    description: "This is Charlie's first post.",
                    comments: [
                        {
                            id: 2,
                            user_id: 3,
                            comment: "Interesting post, Charlie!"
                        }
                    ],
                    likes: [1, 3],
                    dislikes: [2],
                    views: [2, 3],
                    shares: [
                        {
                            receiver_id: 3,
                            url_post: "http://post3.com"
                        }
                    ],
                    notes: [
                        {
                            user_id: 3,
                            note: 7
                        }
                    ]
                }
            ],
            favorites: [3],
            followers: [3]
        },
        {
            id: 3,
            name: "David",
            email: "david@example.com",
            posts: [
                {
                    id: 3,
                    img_link: "https://via.placeholder.com/150",
                    title: "David's First Post",
                    description: "This is David's first post.",
                    comments: [
                        {
                            id: 3,
                            user_id: 4,
                            comment: "Well done, David!"
                        }
                    ],
                    likes: [2, 4],
                    dislikes: [3],
                    views: [3, 4],
                    shares: [
                        {
                            receiver_id: 4,
                            url_post: "http://post4.com"
                        }
                    ],
                    notes: [
                        {
                            user_id: 4,
                            note: 8
                        }
                    ]
                }
            ],
            favorites: [4],
            followers: [4]
        },
        {
            id: 4,
            name: "Eve",
            email: "eve@example.com",
            posts: [
                {
                    id: 4,
                    img_link: "https://via.placeholder.com/150",
                    title: "Eve's First Post",
                    description: "This is Eve's first post.",
                    comments: [
                        {
                            id: 4,
                            user_id: 0,
                            comment: "Great post, Eve!"
                        }
                    ],
                    likes: [3, 4],
                    dislikes: [4],
                    views: [4, 0],
                    shares: [
                        {
                            receiver_id: 0,
                            url_post: "http://post5.com"
                        }
                    ],
                    notes: [
                        {
                            user_id: 0,
                            note: 10
                        }
                    ]
                }
            ],
            favorites: [0],
            followers: [0]
        }, {
            id: 5,
            username: "JohnDoe",
            password: "$2b$10$qplhuP31zZh30NYAh4Fcd.qX716rz/OnTecgA7.nvHxjhGWQmqM.O",
            email: "john.doe@example.com",
            name: "John Doe",
            role: "user",
            posts: [],
            favorites: [],
            followers: [],
        }
    ],
    "models": [
        {
            id: 0,
            name: "Model S",
            price: 79999
        },
        {
            id: 1,
            name: "Model 3",
            price: 39999
        },
        {
            id: 2,
            name: "Model X",
            price: 89999
        },
        {
            id: 3,
            name: "Model Y",
            price: 49999
        },
        {
            id: 4,
            name: "Model A",
            price: 29999
        }
    ],
    "comments": [
        {
            id: 0,
            user_id: 1,
            post_id: 0,
            comment: "Nice post, Alice!"
        },
        {
            id: 1,
            user_id: 2,
            post_id: 1,
            comment: "Great post, Bob!"
        },
        {
            id: 2,
            user_id: 3,
            post_id: 2,
            comment: "Interesting post, Charlie!"
        },
        {
            id: 3,
            user_id: 4,
            post_id: 3,
            comment: "Well done, David!"
        },
        {
            id: 4,
            user_id: 0,
            post_id: 4,
            comment: "Great post, Eve!"
        }
    ],
    "views": [
        {
            id: 0,
            user_id: 0,
            post_id: 1
        },
        {
            id: 1,
            user_id: 1,
            post_id: 2
        },
        {
            id: 2,
            user_id: 2,
            post_id: 3
        },
        {
            id: 3,
            user_id: 3,
            post_id: 4
        },
        {
            id: 4,
            user_id: 4,
            post_id: 0
        }
    ],
    "likes": [
        {
            id: 0,
            user_id: 0,
            post_id: 1
        },
        {
            id: 1,
            user_id: 1,
            post_id: 2
        },
        {
            id: 2,
            user_id: 2,
            post_id: 3
        },
        {
            id: 3,
            user_id: 3,
            post_id: 4
        },
        {
            id: 4,
            user_id: 4,
            post_id: 0
        }
    ],
    "dislikes": [
        {
            id: 0,
            user_id: 0,
            post_id: 2
        },
        {
            id: 1,
            user_id: 1,
            post_id: 3
        },
        {
            id: 2,
            user_id: 2,
            post_id: 4
        },
        {
            id: 3,
            user_id: 3,
            post_id: 0
        },
        {
            id: 4,
            user_id: 4,
            post_id: 1
        }
    ],
    "favorites": [
        {
            id: 0,
            user_id: 0,
            fav_user_id: 1
        },
        {
            id: 1,
            user_id: 1,
            fav_user_id: 2
        },
        {
            id: 2,
            user_id: 2,
            fav_user_id: 3
        },
        {
            id: 3,
            user_id: 3,
            fav_user_id: 4
        },
        {
            id: 4,
            user_id: 4,
            fav_user_id: 0
        }
    ],
    "follows": [
        {
            id: 0,
            following_user_id: 0,
            followed_user_id: 1
        },
        {
            id: 1,
            following_user_id: 1,
            followed_user_id: 2
        },
        {
            id: 2,
            following_user_id: 2,
            followed_user_id: 3
        },
        {
            id: 3,
            following_user_id: 3,
            followed_user_id: 4
        },
        {
            id: 4,
            following_user_id: 4,
            followed_user_id: 0
        }
    ],
    "shares": [
        {
            id: 0,
            user_id: 0,
            receiver_id: 1,
            url_post: "http://post1.com"
        },
        {
            id: 1,
            user_id: 1,
            receiver_id: 2,
            url_post: "http://post2.com"
        },
        {
            id: 2,
            user_id: 2,
            receiver_id: 3,
            url_post: "http://post3.com"
        },
        {
            id: 3,
            user_id: 3,
            receiver_id: 4,
            url_post: "http://post4.com"
        },
        {
            id: 4,
            user_id: 4,
            receiver_id: 0,
            url_post: "http://post5.com"
        }
    ],
    "notes": [
        {
            id: 0,
            user_id: 0,
            post_id: 1,
            note: 8
        },
        {
            id: 1,
            user_id: 1,
            post_id: 2,
            note: 9
        },
        {
            id: 2,
            user_id: 2,
            post_id: 3,
            note: 7
        },
        {
            id: 3,
            user_id: 3,
            post_id: 4,
            note: 8
        },
        {
            id: 4,
            user_id: 4,
            post_id: 0,
            note: 10
        }
    ],
    "reports": [
        {
            id: 0,
            user_id: 0,
            reported_user_id: 1,
            reason: "Spam"
        },
        {
            id: 1,
            user_id: 1,
            reported_user_id: 2,
            reason: "Inappropriate content"
        },
        {
            id: 2,
            user_id: 2,
            reported_user_id: 3,
            reason: "Harassment"
        },
        {
            id: 3,
            user_id: 3,
            reported_user_id: 4,
            reason: "Spam"
        },
        {
            id: 4,
            user_id: 4,
            reported_user_id: 0,
            reason: "Inappropriate content"
        }
    ],
    "posts": [
        {
            id: 0,
            user_id: 0,
            img_link: "https://via.placeholder.com/150",
            title: "Alice's First Post",
            description: "This is Alice's first post.",
            comments: [
                {
                    id: 0,
                    user_id: 1,
                    comment: "Nice post, Alice!"
                }
            ],
            likes: [1, 2],
            dislikes: [0],
            views: [0, 1],
            shares: [
                {
                    id: 0,
                    receiver_id: 1,
                    url_post: "http://post1.com"
                }
            ],
            notes: [
                {
                    user_id: 1,
                    note: 8
                }
            ]
        },
        {
            id: 1,
            user_id: 1,
            img_link: "https://via.placeholder.com/150",
            title: "Bob's First Post",
            description: "This is Bob's first post.",
            comments: [
                {
                    id: 1,
                    user_id: 2,
                    comment: "Great post, Bob!"
                }
            ],
            likes: [0, 2],
            dislikes: [1],
            views: [1, 2],
            shares: [
                {
                    id: 1,
                    receiver_id: 2,
                    url_post: "http://post2.com"
                }
            ],
            notes: [
                {
                    user_id: 2,
                    note: 9
                }
            ]
        },
        {
            id: 2,
            user_id: 2,
            img_link: "https://via.placeholder.com/150",
            title: "Charlie's First Post",
            description: "This is Charlie's first post.",
            comments: [
                {
                    id: 2,
                    user_id: 3,
                    comment: "Interesting post, Charlie!"
                }
            ],
            likes: [1, 3],
            dislikes: [2],
            views: [2, 3],
            shares: [
                {
                    id: 2,
                    receiver_id: 3,
                    url_post: "http://post3.com"
                }
            ],
            notes: [
                {
                    user_id: 3,
                    note: 7
                }
            ]
        },
        {
            id: 3,
            user_id: 3,
            img_link: "https://via.placeholder.com/150",
            title: "David's First Post",
            description: "This is David's first post.",
            comments: [
                {
                    id: 3,
                    user_id: 4,
                    comment: "Well done, David!"
                }
            ],
            likes: [2, 4],
            dislikes: [3],
            views: [3, 4],
            shares: [
                {
                    id: 3,
                    receiver_id: 4,
                    url_post: "http://post4.com"
                }
            ],
            notes: [
                {
                    user_id: 4,
                    note: 8
                }
            ]
        },
        {
            id: 4,
            user_id: 4,
            img_link: "https://via.placeholder.com/150",
            title: "Eve's First Post",
            description: "This is Eve's first post.",
            comments: [
                {
                    id: 4,
                    user_id: 0,
                    comment: "Great post, Eve!"
                }
            ],
            likes: [3, 4],
            dislikes: [4],
            views: [4, 0],
            shares: [
                {
                    id: 4,
                    receiver_id: 0,
                    url_post: "http://post5.com"
                }
            ],
            notes: [
                {
                    user_id: 0,
                    note: 10
                }
            ]
        }
    ]
}

export default db;