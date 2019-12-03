const express = require("express");

const posts = require("../data/db");

const router = express.Router();

router.use(express.json());

router.post("/", (req, res) => {
    const post = req.body;

    if(!post.title || !post.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
    else{
        posts
            .insert(post)
            .then(comment => res.status(201).json(comment))
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Error retrieving the posts"
                });
            });
    }
});

router.post("/:id/comments/", (req, res) => {
    const post = {
        ...req.body,
        post_id: req.params.id
    };
    console.log(post)

    if(!post.post_id){
        console.log(post.post_id)
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }
    else{
        if(!post.text){
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        }
        else{
            posts
            .insertComment(post)
            .then(comment => res.status(201).json(comment))
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "There was an error while saving the comment to the database"
                });
            });
        }
    }
    
});

router.get("/", (req, res) => {
    
    posts
        .find()
        .then(post => {
        
            res.status(200).json(post)
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The posts information could not be retrieved."
            });
        });
});

router.get("/", (req, res) => {
    
    posts
        .find()
        .then(post => {
            console.log(post.id)
            


        })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The posts information could not be retrieved."
            });
        });
});

router.get("/:id", (req, res) => {

    const id = req.params.id;
    //console.log(id)
    if(!id){
        console.log(id)
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    else{
        posts
        .findById(id)
        .then(post => {
            
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving the posts"
            });
        });
    }
    
});

router.get("/:id/comments", (req, res) => {

    posts
        .findPostComments(req.params.id)
        .then(post => res.status(200).json(post))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving the posts"
            });
        });
});

router.delete("/:id", (req, res) => {
    posts
        .remove(req.params.id)
        .then(post => {
            if(post){
                res.status(200).json({message: "Post removed", post})
            }
            else{
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving the posts"
            });
        });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const post = req.body;

    if(!post.title || !post.contents){
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
    else{
        posts
        .update(id, post)
        .then(post => res.status(200).json({message: "Post updated", post}))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be modified."
            });
        });
    }
});

module.exports = router;