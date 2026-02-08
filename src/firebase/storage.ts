import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    listAll,
    deleteObject,
    getMetadata,
    StorageReference,
    UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from './index';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface StorageFile {
    id: string;
    url: string;
    name: string;
    size: string;
    uploadDate: Date;
    type: string;
    fullPath: string;
}

export const uploadImage = (
    file: File,
    onProgress: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            return reject(new Error('File size exceeds 10MB limit'));
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return reject(new Error('Unsupported file type. Please upload an image (JPG, PNG, GIF, WebP)'));
        }

        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot: UploadTaskSnapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error: Error) => reject(error),
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
            }
        );
    });
};

export const listImages = async (): Promise<StorageFile[]> => {
    const listRef = ref(storage, 'images');
    const result = await listAll(listRef);

    const files = await Promise.all(
        result.items.map(async (item: StorageReference) => {
            const url = await getDownloadURL(item);
            const metadata = await getMetadata(item);

            return {
                id: item.name,
                url,
                name: item.name,
                size: (metadata.size / (1024 * 1024)).toFixed(2) + ' MB',
                uploadDate: new Date(metadata.timeCreated),
                type: metadata.contentType || 'image',
                fullPath: item.fullPath
            };
        })
    );

    return files;
};

export const deleteImage = async (path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
};
