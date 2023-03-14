module.exports = {
  getIndex: (req, res) => {
    if(req.user){
      res.redirect(`/profile/${req.user.id}`)
    }
    else{
      res.render("index.ejs")
    }
  },
};
