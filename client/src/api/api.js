import * as axios from "axios";

const instance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})


const instance2 = axios.create({
  baseURL: 'https://deezerdevs-deezer.p.rapidapi.com/',
  headers: {
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    "x-rapidapi-key": "f572c7a6b3mshd8a0937a930fe2dp1cd8dejsn9a20c43c9bbf",
    "useQueryString": true
  }
})

export const usersAPI = {
  setOnline() {
    return instance.put('users/online', {
      isOnline: true
    })
  },
  setOffline() {
    return instance.put('users/online', {
      isOnline: false
    })
  },
  getUsers(pageSize, currentPage) {
    return instance.get(`users?limit=${pageSize}&page=${currentPage}`)
  },
  register(authData) {
    return instance.post(`users`, authData)
  },
  follow(userId) {
    return instance.post(`follow/${userId}`)
  },
  unfollow(userId) {
    return instance.delete(`follow/${userId}`)
  }
}

export const profileAPI = {
  getProfile(userId) {
    return instance.get(`profile/user/${userId}`)
  },
  getStatus(userId) {
    return instance.get(`profile/status/${userId}`)
  },
  setStatus(status) {
    return instance.put(`profile/status`, {status})
  },
  updateProfile(userInfo) {
    return instance.post(`profile`, userInfo)
  },
  async uploadPhoto(photoFile) {
    const formData = new FormData()
    formData.append("image", photoFile)

    const response = await axios.post('https://api.imgbb.com/1/upload?key=a7e49a85e63e9a3a9bbb885a2f7d6f7f', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return instance.put('profile/avatar', response.data.data.thumb)
  }
}

export const postAPI = {
  createPost(formData) {
    return instance.post(`posts`, {text: formData.text, profile: formData.profile})
  },
  getPosts(userId) {
    return instance.get(`posts/${userId}`)
  },
  like(id) {
    return instance.put(`posts/like/${id}`)
  },
  dislike(id) {
    return instance.put(`posts/unlike/${id}`)
  },
  deletePost(id) {
    return instance.delete(`posts/${id}`)
  },
  addComment(postId, formData) {
    return instance.post(`posts/comment/${postId}`, formData)
  },
  addReply(postId, commentId, formData) {
    return instance.post(`posts/comment/${postId}/${commentId}`, formData)
  },
  deleteComment(postId, commentId) {
    return instance.delete(`posts/comment/${postId}/${commentId}`)
  },
  deleteReply(postId, commentId, replyId) {
    return instance.put(`posts/comment/${postId}/${commentId}/${replyId}`)
  }
}

export const messageAPI = {
  createDialog(participants, name, message) {
    debugger
    return instance.post(`dialogs/`, {participants, name, message})
  },
  createMessage(dialogRoomId, text) {
    return instance.post(`dialogs/${dialogRoomId}/message`, {text})
  },
  deleteDialog(dialogRoomId) {
    return instance.delete(`dialogs/${dialogRoomId}`)
  },
  deleteMessage(dialogRoomId, messageId) {
    return instance.delete(`dialogs/${dialogRoomId}/${messageId}`)
  },
  readMessage(dialogRoomId, messageId) {
    return instance.put(`dialogs/${dialogRoomId}/${messageId}`)
  },
  editMessage(dialogRoomId, messageId, text) {
    return instance.put(`dialogs/${dialogRoomId}/${messageId}`, {text})
  },
  getDialogs() {
    return instance.get('dialogs')
  },
  getMessages(id) {
    return instance.get(`dialogs/${id}/messages`)
  }
}

export const authAPI = {
  me() {
    return instance.get(`auth/me`)
  },
  login({email, password}) {
    return instance.post(`auth/login`, {email, password})
  }
}

export const musicAPI = {
  getChart() {
    return instance2.get(`playlist/8051363162/tracks`)
  },
  findMusic(inputValue) {
    return instance2.get(`search?q=${inputValue}`)
  }
}


export default instance;
