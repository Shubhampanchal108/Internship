const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

commentSchema.post('save', async function () {
  const Post = mongoose.model('Post');
  const count = await mongoose.model('Comment').countDocuments({ post: this.post, parentComment: null });
  await Post.findByIdAndUpdate(this.post, { commentsCount: count });
});

commentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Post = mongoose.model('Post');
    const count = await mongoose.model('Comment').countDocuments({ post: doc.post, parentComment: null });
    await Post.findByIdAndUpdate(doc.post, { commentsCount: count });
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
