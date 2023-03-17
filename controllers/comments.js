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

    }
}