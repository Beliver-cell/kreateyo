const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getFiles,
  getFile,
  uploadFile,
  updateFile,
  deleteFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');
const { upload } = require('../middleware/upload');

// All routes are protected
router.use(protect);
router.use(checkTeamMember);

router.route('/')
  .get(getFiles)
  .post(checkPermission('write'), upload.single('file'), uploadFile);

router.route('/:id')
  .get(getFile)
  .put(checkPermission('write'), updateFile)
  .delete(checkPermission('delete'), deleteFile);

module.exports = router;
