const express = require ('express')
const router = express.Router()
const usersController = require ('../controllers/notesController')

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router    