import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const { isFavourite } = parseFilterParams(req.query);  
  const { _id: userId } = req.user;
  
  const contacts = await getAllContacts({ 
    userId,
    page,
    perPage,
    sortOrder,
    sortBy,
    isFavourite,
  });
  
  
    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts
    });
  };

  export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const data = await getContactById(contactId, userId);

    if (!data) {
        throw createHttpError(404, 'Contact not found');
      }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
    });
  };

  export const createContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const photo = req.file;

    let photoUrl;

    if (photo) {

        if (getEnvVar("ENABLE_CLOUDINARY") === "true") {

            photoUrl = await saveFileToCloudinary(photo);

        } else {
            photoUrl = await saveFileToUploadDir(photo);

        }
    }

    const data = await createContact({userId, ...req.body, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data,
  });
  };

  export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (getEnvVar("ENABLE_CLOUDINARY") === "true") {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }
    
    const result = await updateContact(contactId, { ...req.body, photo: photoUrl }, userId);
  
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
  
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  };

  export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const data = await deleteContact(contactId, userId);

    if (!data) {
      throw createHttpError(404, 'Contact not found');
    }
  
    res.status(204).send();
  };