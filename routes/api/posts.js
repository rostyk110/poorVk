const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Reply = require('../../models/Reply');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [auth,
    [
      check('text', 'Text is required').not().isEmpty().isString().isLength({max: 4096}),
      check('profile', 'ProfileId is required').not().isEmpty().isString().isLength({max: 32}),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        profile: req.body.profile
      });

      const post = await newPost.save();

      await post.populate('user', ['avatar', 'fullName']).execPopulate()

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts/:id
// @desc     Get all posts by userId
// @access   Private
router.get('/:id', async (req, res) => {
  try {
    const posts = await Post.find({profile: req.params.id})
      .populate('user', ['avatar', 'fullName'])
      .populate({path: 'comments.user', model: 'user', select: ['avatar', 'fullName']})
      .populate({path: 'comments.replies.user', model: 'user', select: ['avatar', 'fullName']})
      .populate({path: 'comments.replies.to.user', model: 'user', select: ['avatar', 'fullName']})
      .sort({date: -1});

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({msg: 'Post not found'})
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({msg: 'Post not found'});
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User not authorized'});
    }

    await post.remove();

    res.json({msg: 'Post removed'});
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({msg: 'Post already liked'});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({msg: 'Post has not yet been liked'});
    }

    // remove the like
    post.likes = post.likes.filter(
      ({user}) => user.toString() !== req.user.id
    );

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty().isString().isLength({max: 4096})]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const post = await Post.findById(req.params.id)

      const newComment = new Comment({
        text: req.body.text,
        user: req.user.id
      })

      await newComment.populate('user', ['avatar', 'fullName']).execPopulate();

      post.comments.push(newComment);
      await post.save();

      res.json(newComment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(comment => comment._id.equals(req.params.comment_id));

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({msg: 'Comment does not exist'});
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User not authorized'});
    }

    post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.comment_id);

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    POST api/posts/comment/:postId/:commentId
// @desc     Add reply
// @access   Private
router.post('/comment/:postId/:commentId', [
  auth,
  [
    check('text', 'Text is required').not().isEmpty().isString().isLength({max: 300}),
    check('to.id', 'To id is required').not().isEmpty().isString().isLength({max: 32}),
  ]
], async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.find(c => c._id.equals(req.params.commentId));

    const newReply = new Reply({
      text: req.body.text,
      to: {
        user: req.body.to.id
      },
      user: req.user.id
    })

    await newReply
      .populate({path: 'user', select: ['avatar', 'fullName']})
      .populate({path: 'to.user', select: ['avatar', 'fullName']})
      .execPopulate();

    comment.replies.push(newReply)
    post.markModified('comments');
    await post.save();

    return res.json(newReply);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


// @route    POST api/posts/comment/:postId/:commentId/:replyId
// @desc     Delete reply
// @access   Private
router.put('/comment/:postId/:commentId/:replyId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const newComments = post.comments.map(c => {
      if (c._id.equals(req.params.commentId)) {
        c.replies = c.replies.filter(r => !r._id.equals(req.params.replyId))
      } else {
        return c
      }
    })

    await post.save({comments: newComments});

    return res.json({resultCode: 0});
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


module.exports = router;
