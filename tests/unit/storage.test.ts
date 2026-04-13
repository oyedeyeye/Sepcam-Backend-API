import { ContainerClient } from '@azure/storage-blob';
import { uploadBlobToContainer } from '../../src/services/storage';

jest.mock('@azure/storage-blob');

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a blob to the container successfully with a specified formatted blob name', async () => {
    const mockUploadFile = jest.fn().mockResolvedValue({});
    const mockGetBlockBlobClient = jest.fn().mockReturnValue({ uploadFile: mockUploadFile });
    
    const mockContainerClient = {
      getBlockBlobClient: mockGetBlockBlobClient
    } as unknown as ContainerClient;
    
    // Testing the logic where the blob carries the title instead of generated numbers
    const blobName = 'the-glory-of-god.mp3';
    await expect(uploadBlobToContainer(mockContainerClient, '/tmp/file.mp3', blobName)).resolves.toBeUndefined();
    
    expect(mockGetBlockBlobClient).toHaveBeenCalledWith('the-glory-of-god.mp3');
    expect(mockUploadFile).toHaveBeenCalledWith('/tmp/file.mp3');
  });
});
