const User = require('./models/User')

module.exports = function(io) {
  io.on('connection', socket => {
    socket.on('sign in', async userId => {
      await User.findByIdAndUpdate(userId, {socketId: socket.id})
      socket.broadcast.emit('sign in bc', userId);
    })
    socket.on('join dialog', dialog => {
      socket.join(dialog.id)
    })
    socket.on('leave channel', dialog => {
      socket.leave(dialog.id)
    })
    socket.on('chat message', msg => {
      socket.broadcast.to(msg.dialog).emit('new bc message', msg);
    });
    socket.on('new dialog',  (usersId, dialog) => {
      Promise.all(usersId.map(async id => {
        const {socketId} = await User.findById(id)
        return socketId
      })).then(socketIds => {
        socketIds.forEach(socketId => {
          io.to(socketId).emit('new bc dialog', dialog)
        })
      })
    });
    socket.on('delete message', msg => {
      socket.broadcast.to(msg.dialog).emit('delete bc message', msg);
    });
    socket.on('edit message', (msg) => {
      socket.broadcast.to(msg.dialog).emit('edit bc message', msg);
    });
    socket.on('delete dialog', dialog => {
      socket.broadcast.to(dialog._id).emit('delete bc dialog', dialog);
    });
    socket.on('set message read', (dialog, _id, userId) => {
      socket.broadcast.to(dialog).emit('set bc message read', dialog, _id, userId);
    });
    socket.on('typing', data => {
        socket.broadcast.to(data.dialogId).emit('typing bc', {dialogId: data.dialogId, username: data.username})
      }
    );
    socket.on('stop typing', data =>
      socket.broadcast.to(data.dialogId).emit('stop typing bc', {dialogId: data.dialogId, username: data.username})
    );
    socket.on('live search', async (userId, input, pageSize, currentPage) => {
        socket.emit('live search bc', await require('./utils/liveSearch')(userId, input, pageSize, currentPage))
      }
    );
    // socket.on('like comment', date => {
    //
    // })
    socket.on('disconnect', async () => {
      const user = await User.findOne({socketId: socket.id})

      if (user) {
        user.online = false
        await user.save()
        socket.broadcast.emit('sign out bc', user._id);
      }
    })
  });
}
