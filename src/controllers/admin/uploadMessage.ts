import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { pdfClient, audioClient, imageClient, uploadBlobToContainer } from '../../services/storage';
import path from 'path';


const slugifyTitle = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const uploadMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { theme, title, caption, description, serviceTag, youtubeLink, preacher, preacherThumbnail } = req.body;
    
    if (!title) {
      res.status(400).json({ message: 'Title is required for slugification.' });
      return;
    }

    const safeTitle = slugifyTitle(title);

    let audioBlobName = null;
    let pdfBlobName = null;
    let imageBlobName = null;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files && files.messageThumbnail && files.messageThumbnail[0]) {
      const ext = path.extname(files.messageThumbnail[0].originalname) || '.jpg';
      imageBlobName = `${safeTitle}${ext}`;
      await uploadBlobToContainer(imageClient(), files.messageThumbnail[0].path, imageBlobName);
    }

    if (files && files.audioFile && files.audioFile[0]) {
      const ext = path.extname(files.audioFile[0].originalname) || '.mp3';
      audioBlobName = `${safeTitle}${ext}`;
      await uploadBlobToContainer(audioClient(), files.audioFile[0].path, audioBlobName);
    }

    if (files && files.pdfFile && files.pdfFile[0]) {
      const ext = path.extname(files.pdfFile[0].originalname) || '.pdf';
      pdfBlobName = `${safeTitle}${ext}`;
      await uploadBlobToContainer(pdfClient(), files.pdfFile[0].path, pdfBlobName);
    }

    const newMessage = await prisma.message.create({
      data: {
        title,
        theme,
        caption,
        description,
        serviceTag,
        youtubeLink,
        preacher,
        preacherThumbnail,
        messageThumbnail: imageBlobName,
        audioFile: audioBlobName,
        pdfFile: pdfBlobName
      }
    });

    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
