import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export function setupServer() {

    const PORT = Number(getEnvVar('PORT', '3000'));

    const app = express();
    
    app.use(
        pino({
          transport: {
            target: 'pino-pretty',
          },
        }),
      );

    app.use(cors());

    app.use('*', (req, res, next) => {
        res.status(404).json({
          message: 'Not found',
        });
      });
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.get('/contacts', async (req, res) => {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
      });
    });

    app.get('/contacts/:contactId', async (req, res) => {
      const { contactId } = req.params;
      const contact = await getContactById();

      if(!contact) {
        res.status(404).json({
          message:"Contact not found"
        });
        return;
      }
      res.status(200).json({
        status: 200,
      	message: "Successfully found contact with id {contactId}!",
        data: contact,
      });
    });
};