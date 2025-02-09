const cloudinary = require("../middleware/cloudinary");
const Comments = require("../models/Comments");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id });
      const userProfile = await User.findById({_id: req.params.id})
      res.render("profile.ejs", { posts: posts, user: req.user, userProfile: userProfile });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean().populate('user')
      res.render("feed.ejs", { posts: posts, loggedUser: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('user')
      console.log(post)
      const allUsers = await User.find()
      const comments = await Comments.find({post: req.params.id}).sort({ createdAt: "desc" }).lean()
      const likedByUsers = []
      post.likedBy.forEach(x => {
          let index = allUsers.findIndex(el => el._id == x)
          likedByUsers.push(allUsers[index].userName)
        })
      
      let currentDate = new Date(Date.now())
      for(let i = 0; i< comments.length; i++){
        let user = await User.findById(comments[i].user)
        comments[i].userName = user.userName

        let dateDiff = Math.floor((currentDate - comments[i].createdAt)/84400000)
        comments[i].dateDiff = dateDiff
      }
      res.render("post.ejs", { post: post, user: req.user, likedByUsers: likedByUsers, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path)
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id })
      if(post.likedBy.includes(req.user.id)){
        await post.updateOne({
          $inc: { likes: -1},
          $pull: { likedBy: req.user.id},
        })
        console.log("Likes -1");
      }
      else{
        await post.updateOne({
          $inc: { likes: 1 },
          $push: { likedBy: req.user.id}
        })
        console.log("Likes +1");
      }
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.remove({ _id: req.params.id });
      await Comments.deleteMany({post: req.params.id})
      console.log("Deleted Post");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      res.redirect(`/profile/${req.user.id}`);
    }
  },
};
