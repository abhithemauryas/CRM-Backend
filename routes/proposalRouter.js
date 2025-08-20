const mongoose =require("mongoose")
const express= require("express")
const proposalModel = require("../models/proposalModel")
const proposalRouter= express.Router()


proposalRouter.post("/proposal/create", async(req,res)=>{
    try {
         console.log("Received payload:", req.body);
        const proposalData={
            ...req.body,
 createdBy: req.user?.id 
 
        }
    const newProposal= new proposalModel(proposalData)
    await newProposal.save()
    console.log("proposalData",proposalData)
    res.status(201).send({ message: "Proposal created successfully", proposal: newProposal });
    } catch (error) {
       res.status(500).send({ message: "Failed to create proposal", error: error.message }); 
    }
})

proposalRouter.get("/proposal/find/all",async(req,res)=>{
    try {
        const proposals= await proposalModel.find()
      .populate("assignees");
    res.status(200).send({message: "proposals fetched successfully",proposals});
    } catch (error) {
          res.status(500).send({ message: "Error fetching proposals", error: error.message });
    }
})

proposalRouter.get("/proposal/:id",async(req,res)=>{
    try {
        const proposal= await proposalModel.findById(req.params.id).populate("leadId") .populate("assignees");
    if (!proposal) {
      return res.status(404).send({ message: "Proposal not found" });
    }
  res.status(200).send(proposal);
    } catch (error) {
        res.status(500).send({ message: "Error fetching proposal", error: error.message });   
    }
})

proposalRouter.put("/proposal/:id", async (req, res) => {
  try {
    const updatedProposal = await proposalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProposal) {
      return res.status(404).send({ message: "Proposal not found" });
    }
    res.status(200).send({ message: "Proposal updated", proposal: updatedProposal });
  } catch (error) {
    res.status(500).send({ message: "Error updating proposal", error: error.message });
  }
});


proposalRouter.delete("/proposal/:id", async (req, res) => {
  try {
    const deletedProposal = await proposalModel.findByIdAndDelete(req.params.id);
    if (!deletedProposal) {
      return res.status(404).send({ message: "Proposal not found" });
    }
    res.status(200).send({ message: "Proposal deleted" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting proposal", error: error.message });
  }
});


module.exports=proposalRouter
