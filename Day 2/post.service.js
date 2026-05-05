const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPagination } = require('../utils/pagination');
const { POST_STATUS } = require('../config/constants');

/**
 * Create a new post
 */
const createPost = async (authorId, postData) => {
  const post = await Post.create({ ...postData, author: authorId });
  return post.populate('author', 'name email avatar');
};

/**
 * Get all published posts (public feed)
 */
const getAllPosts = async (query) => {
  const { page, limit, skip } = getPaginationOptions(query);

  const filter = { status: POST_STATUS.PUBLISHED };

  if (query.tag) filter.tags = query.tag.toLowerCase();
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortOptions = {};
  if (query.sort === 'views') sortOptions.views = -1;
  else if (query.sort === 'oldest') sortOptions.createdAt = 1;
  else sortOptions.createdAt = -1; // default: newest

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email avatar')
      .select('-content') // Exclude full content in list view
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  return { posts, pagination: getPagination(page, limit, total) };
};

/**
 * Get a single post by slug (increments view count)
 */
const getPostBySlug = async (slug) => {
  const post = await Post.findOneAndUpdate(
    { slug, status: POST_STATUS.PUBLISHED },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('author', 'name email avatar bio')
    .populate({
      path: 'comments',
      match: { parentComment: null },
      populate: [
        { path: 'author', select: 'name avatar' },
        { path: 'replies', populate: { path: 'author', select: 'name avatar' } },
      ],
      options: { sort: { createdAt: -1 }, limit: 20 },
    });

  if (!post) throw new AppError('Post not found', 404);
  return post;
};

/**
 * Get all posts by a specific user (public: only published; owner: all)
 */
const getPostsByUser = async (userId, query, requesterId) => {
  const { page, limit, skip } = getPaginationOptions(query);

  // Only the owner can see their draft posts
  const filter = { author: userId };
  if (requesterId?.toString() !== userId.toString()) {
    filter.status = POST_STATUS.PUBLISHED;
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email avatar')
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  return { posts, pagination: getPagination(page, limit, total) };
};

/**
 * Get post by ID (for owner operations)
 */
const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('author', 'name email avatar');
  if (!post) throw new AppError('Post not found', 404);
  return post;
};

/**
 * Update a post (owner only — enforced in controller)
 */
const updatePost = async (postId, authorId, updateData) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);
  if (post.author.toString() !== authorId.toString()) {
    throw new AppError('You are not authorized to update this post', 403);
  }

  const allowedFields = ['title', 'content', 'excerpt', 'tags', 'status', 'coverImage'];
  allowedFields.forEach((key) => {
    if (updateData[key] !== undefined) post[key] = updateData[key];
  });

  await post.save();
  return post.populate('author', 'name email avatar');
};

/**
 * Delete a post (owner only)
 */
const deletePost = async (postId, authorId, userRole) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  // Admins can delete any post
  if (userRole !== 'admin' && post.author.toString() !== authorId.toString()) {
    throw new AppError('You are not authorized to delete this post', 403);
  }

  await post.deleteOne();
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
};
