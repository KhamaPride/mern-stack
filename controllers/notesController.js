const Note = require ('../models/Note')
const User = require ('../models/User')
const asyncHandler = require ('express-async-handler')


//@desc Get All notes
//@route GET /notes
//@access Private
const getAllNotes = asyncHandler(async(req, res)=>{
    //get all notes
    const notes = await Note.find().lean()
    //if no note found
    if(!notes?.length){
        return res.status(400).json({message: "No Notes Found"})
    }
    //add username to each note before sending the response
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})
//@desc Create new note
//@route POST /notes
//@access Private
const createNote = asyncHandler(async(req, res)=>{
    const {user, title,text }= req.body

    //confirm data
    if(!user || !title || !text){
        return res.status(400).json({message: "All fields are required"})

       }     
       //check if note with similar title exists
        const duplicate = await Note.findOne({title}).lean().exec()
       
        if(duplicate){
            return res.status(409).json({message: "Note title already exists"})
        }
        
        //create and store new note
        const note = await Note.create(noteObject)

        if(note){
            res.status(201).json({message: `Note ${title} created successfully`})
        }
        else{
            res.status(400).json({message: "Failed to create note"})
        }
    })
//@desc Update note
//@route PATCH /notes
//@access Private
const updateNote = asyncHandler(async(req, res)=>{
    const {id, user, title, text, completed} =req.body

    //confirm data
    if(!id || !user || !title || !text || typeof completed !=='boolean'){
        return res.status(400).json({message:'All fields are required'})
    }

    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message:"Note not found"})
    }
    //check for duplicates
    const duplicate = await Note.findOne({title}).lean().exec()

    //allow updates to original note
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate note"})
    }
    note.title = title
    note.text = text
    note.user = user
    note.completed = completed

    const updatedNote = await note.save()

    res.json({message:`'${updatedNote.title}' updated`})
})
//@desc Delete note
//@route DELETE /notes
//@access Private
const deleteNote = asyncHandler(async(req, res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({message:'Note ID required'})
    }
    //confirm note exists to delete
    const note = await Note.findById(id).exec()

    //if note does not exist
    if(!note){
        return res.status(400).json({message:"Note does not exist"})
    }
    //delete note and save to variable result
    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result.id} deleted`

    res.json(reply)
})

module.exports ={
    getAllNotes,
    createNote, 
    updateNote, 
    deleteNote
}