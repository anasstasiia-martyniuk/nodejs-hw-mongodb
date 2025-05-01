import ContactCollection  from "../db/models/Contact.js";
import { SORT_ORDER } from '../constants/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = SORT_ORDER[0], userId }) => {
  const skip = (page - 1) * perPage;
  const data = await ContactCollection.find({ userId }).skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
  const totalItems = await ContactCollection.countDocuments({ userId });

  const paginationData = calculatePaginationData({ page, perPage, totalItems });

  return {
      data,
      page,
      perPage,
      totalItems,
      ...paginationData,
  };
};
export const getContactById = async (contactId, userId) => {
    const contact = await ContactCollection.findOne({ _id: contactId, userId });
    return contact;
};
export const createContact = async (payload) => {
    const contact = await ContactCollection.create(payload);
    return contact;
  };

export const updateContact = async (_id, payload, userId, options = {}) => {
    const rawResult = await ContactCollection.findOneAndUpdate(
      { _id, userId },
        payload,
        {
          new: true,
          includeResultMetadata: true,
          ...options,
        },
      );
    
      if (!rawResult || !rawResult.value) return null;
    
      return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
      };
  };

  export const deleteContact = (_id, userId) => ContactCollection.findOneAndDelete({ _id, userId });