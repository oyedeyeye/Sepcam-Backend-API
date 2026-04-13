"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBlobToContainer = exports.imageClient = exports.audioClient = exports.pdfClient = exports.getContainerClient = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
let blobServiceClient;
if (connectionString) {
    blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
}
const getContainerClient = (containerName) => {
    if (!blobServiceClient)
        throw new Error('Azure Storage Connection String not configured.');
    return blobServiceClient.getContainerClient(containerName);
};
exports.getContainerClient = getContainerClient;
// Singleton-like getters for clients
const pdfClient = () => (0, exports.getContainerClient)(process.env.AZURE_PDF_CONTAINER || 'pdfs');
exports.pdfClient = pdfClient;
const audioClient = () => (0, exports.getContainerClient)(process.env.AZURE_AUDIO_CONTAINER || 'audios');
exports.audioClient = audioClient;
const imageClient = () => (0, exports.getContainerClient)(process.env.AZURE_IMAGE_CONTAINER || 'images');
exports.imageClient = imageClient;
const uploadBlobToContainer = async (containerClient, filePath, blobName) => {
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadFile(filePath);
    }
    catch (error) {
        throw new Error(`Failed to upload blob ${blobName}: ${error.message}`);
    }
};
exports.uploadBlobToContainer = uploadBlobToContainer;
