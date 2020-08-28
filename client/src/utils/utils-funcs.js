export const isPostLiked = (likes, userId) => {
  return likes.some(post => {
    return post.user === userId
  })
}

export const getFirstName = fullName => {
  return fullName.split(' ')[0]
}

export const structuralMessages = (messages, userId) => {
  let isFirstUnreadMessageFound = false

  return messages.reduce((acc, message) => {
    const date = message.date.split('T')[0]
    acc[date] = acc[date] || []
    if (!isFirstUnreadMessageFound) {
      if (!message.isRead.includes(userId) && message.user._id !== userId) {
        acc[date].push({...message, isFirstUnread: true})
        isFirstUnreadMessageFound = true
      } else {
        acc[date].push(message)
      }
    } else {
      acc[date].push(message)
    }

    return acc
  }, {})
}

export const formatDate = mongoDate => {
  const date = new Date(mongoDate)
  const diff = new Date() - date

  const sec = Math.floor(diff / 1000)
  const min = Math.floor(diff / 60000)
  const hour = Math.floor(diff / 3600000)

  if (diff < 1000) return 'now'
  if (sec < 60) return sec + ' sec ago'
  if (min < 60) return min + ' min ago'
  if (hour < 3) return hour + ' hour ago'

  const d = [
    '0' + date.getDate(),
    '0' + (date.getMonth() + 1),
    '' + date.getFullYear(),
    '0' + date.getHours(),
    '0' + date.getMinutes()
  ].map(component => component.slice(-2))

  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':')
}

export const cutMessage = (msg, lengthToCut) => {
  if (msg.length > lengthToCut) {
    return msg.slice(0, lengthToCut) + "..."
  }
  return msg
}

export  const formatTypeWritersName = typeWriter => {
  if (typeWriter.length === 1) {
    return `${typeWriter[0].username} is typing...`
  } else if (typeWriter.length === 2) {
    return `${typeWriter[0].username} and ${typeWriter[1].username} are typing...`
  } else if (typeWriter.length > 2){

  }
}

export const countUnreadMessages = (dialogs, userId) => {
  return dialogs.reduce((acc, dialog) => {
    if(dialog.messages) {
      dialog.messages.forEach(m => {
        if (!m.isRead.includes(userId) && m.user._id !== userId) {
          acc += 1
        }
      })
    }
    return acc
  }, 0)
}

export const toSeconds = time => {
  if (time < 10) {
    return '0:0' + time
  } else if (time < 60) {
    return '0:' + time
  } else {
    const rest = (time % 60 < 10) ? `0${time % 60}` : `${time % 60}`
    return `${Math.floor(time / 60)}:${rest}`
  }
}

export const sortByLastMessage = (a, b) => {
  return +new Date(b.lastMessage.date) - +new Date(a.lastMessage.date)
}
