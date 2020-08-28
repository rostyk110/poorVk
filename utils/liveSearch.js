const User = require('../models/User')

module.exports = async function (userId, input, pageSize, currentPage) {
  try {
    const options = {
      page: currentPage,
      limit: pageSize,
      select: ['_id', 'avatar', 'status', 'online', 'fullName'],
    };

    const authedUser = await User.findOne({_id: userId})
    const users = await User.paginate({fullName: {"$regex": input, "$options": "i"}, _id: {$ne: userId}}, options);

    return {
      users: users.docs
        .map(user => {
          const {_id, status, avatar, fullName} = user

          let isFollowed;
          if (authedUser) {
            isFollowed = authedUser.following.find(followingUser => {
              return followingUser._id.equals(_id)
            })
          }

          return {
            id: _id,
            fullName,
            status,
            avatar,
            followed: authedUser ? !!isFollowed : null
          }
        }),
      totalUsersCount: users.totalDocs
    }
  } catch (e) {
    console.log(e)
  }
}


