import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

let blobServiceClient: BlobServiceClient;
if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
}

export const getContainerClient = (containerName: string): ContainerClient => {
  if (!blobServiceClient) throw new Error('Azure Storage Connection String not configured.');
  return blobServiceClient.getContainerClient(containerName);
};

// Singleton-like getters for clients
export const pdfClient = () => getContainerClient(process.env.AZURE_PDF_CONTAINER || 'pdfs');
export const audioClient = () => getContainerClient(process.env.AZURE_AUDIO_CONTAINER || 'audios');
export const imageClient = () => getContainerClient(process.env.AZURE_IMAGE_CONTAINER || 'images');

export const uploadBlobToContainer = async (
  containerClient: ContainerClient,
  filePath: string,
  blobName: string
): Promise<void> => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(filePath);
  } catch (error: any) {
    throw new Error(`Failed to upload blob ${blobName}: ${error.message}`);
  }
};
