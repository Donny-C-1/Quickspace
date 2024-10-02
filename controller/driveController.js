import folderModel from "../models/folder_schema.js";
import fileModel from "../models/file_schema.js";
import asyncHandler from "express-async-handler";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads/");
  },
  filename: function (req, file, cb) {
    console.debug("File");
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

const drive = [
  {
    name: "Image1",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image2",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image3",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image4",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image5",
    size: 23894,
    created: Date.now()
  }
];

const displayDrive = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: null });
  const files = await fileModel.find();
  res.locals.files = [...files, ...drive];
  res.render("drive");
});

const displayFolder = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: req.params.id });
  res.locals.files = await fileModel.find({ location: req.params.id });
  res.locals.dir = req.params.id;
  console.log(res.locals.folders);
  res.render("drive");
});

const handlerCreateFolderLogic = asyncHandler(async (req, res) => {
  await folderModel.create({
    name: req.body.folder_name,
    parent: req.body.dir || null,
    created: Date.now()
  });
  req.body.dir
    ? res.redirect(`/drive/folder/${req.body.dir}`)
    : res.redirect("/drive");
});

const handleFileUpload = [
  upload.single("file_upload"),
  asyncHandler(async (req, res) => {
    console.debug("File Upload");
    await fileModel.create({
      name: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      created: Date.now(),
      location: req.body.dir || null
    });

    req.body.dir
      ? res.redirect(`/drive/folder/${req.body.dir}`)
      : res.redirect("/drive");
  })
];

export {
  displayDrive,
  displayFolder,
  handlerCreateFolderLogic,
  handleFileUpload
};
