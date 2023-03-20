const Comments = require('../models/Comments')

module.exports = {
    newComment: async (req, res) => {
        try{
            await Comments.create({
                comment: req.body.comment,
                user: req.user.id,
                post: req.params.postId
            })
            res.redirect(`/post/${req.params.postId}`)
        }
        catch(err){
            console.log(err)
        }

    },
    deleteComment: async (req, res) => {
        try{
            let comment = await Comments.findById({_id: req.params.commentId})
            await Comments.deleteOne({_id: req.params.commentId})
            console.log("Deleted Comments");
            res.redirect(`/post/${comment.post}`);
        }
        catch(err){
            console.log(err)
        }
    }
}