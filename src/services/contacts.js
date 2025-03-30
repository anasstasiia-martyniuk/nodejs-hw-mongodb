import ContactCollection from "../db/models/Contact.js";

export const getAllContacts = async () => {
    const contacts = await ContactCollection.find();
    return contacts;
};

export const getContactById = async () => {
    const contact = await ContactCollection.findOne({_id: id});
    return contact;
};