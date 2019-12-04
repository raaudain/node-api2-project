const express = require("express");

const posts = require("../data/db");

const router = express.Router();

router.use(express.json());

// Creates a post using the information sent inside the request body.
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

// Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/:id/comments", (req, res) => {
    const body = req.body;
    const id = req.params.id;
    //console.log("you",body)
    //const id = post_id
    console.log(req.params.id)
    if(!body.text){   
        //console.log(text)    
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    else{
        posts
            .findById(id)
            .then(comment => {
                console.log("findById",comment)
                console.log("body.text", body.text)
                if(comment.length === 0){
                    console.log("if", comment)
                    res.status(404).json({message: "The post with the specified ID does not exist."})
                }
                else{
                    posts
                        // Sets and inserts text and post_id 
                        .insertComment({text: body.text, post_id: id})
                        .then(r => {
                            console.log("else", r, body)
                            res.status(201).json(body)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: "There was an error while saving the comment to the database"
                            });
                        });
                }
        })
    }
});

// Returns an array of all the post objects contained in the database.
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

// Returns the post object with the specified id.
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

// Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id", (req, res) => {

    const id = req.params.id;
        posts
        .findById(id)
        .then(post => {
            if(post.length === 0){
                console.log(id)
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
            else{
            res.status(200).json(post)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be retrieved."
            });
        });
});

// Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", (req, res) => {

    posts
        .findPostComments(req.params.id)
        .then(post => {
            if(post.length === 0){
                res.status(404).json({message: "The post with the specified ID does not exist."});
            }
            else{
                res.status(200).json(post);
            } 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The comments information could not be retrieved."
            });
        });
});

// Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete("/:id", (req, res) => {
    posts
        .remove(req.params.id)
        .then(post => {
            if(post > 0){
                res.status(200).json({message: "Post removed", post})
            }
            else{
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post could not be removed"
            });
        });
});

// Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const post = req.body;
    
    if(!post.title || !post.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    else{
        posts
            .findById(id)
            .then(resp => {
                // Checking if anything is there
                if(resp.length === 0){
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                }
                else{
                    posts
                        .update(id, post)
                        .then(pos => res.status(200).json({message: "Post updated", post}))
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: "The post information could not be modified."});
                        });
                }
            })
        
    }
});

module.exports = router;