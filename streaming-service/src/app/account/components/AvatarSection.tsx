import React, { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { useDropzone, type FileRejection } from 'react-dropzone';
import SectionLayout from './SectionLayout'
import ConfirmButton from './ConfirmButton'
import AlertContainer, { type Alert } from './AlertContainer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = {
    'image/jpeg': [],
    'image/png': [],
    'image/webp': []
};

const createImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);
        image.src = src;
    });

const getCroppedImageDataUrl = async (imageSrc: string, pixelCrop: Area) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Canvas context not available');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/png');
};

function AvatarSection({ onAvatarUpdated }: { onAvatarUpdated?: (avatarUrl: string) => void }) {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [alertVar, setAlert] = useState<Alert | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setAlert(null);

        if (fileRejections.length > 0) {
            const errorCode = fileRejections[0].errors[0]?.code;

            if (errorCode === 'file-too-large') {
                setAlert({ type: 'error', message: 'The file is too large. Maximum size is 5 MB.' });
            } else if (errorCode === 'file-invalid-type') {
                setAlert({ type: 'error', message: 'Only jpg, png and webp images are allowed.' });
            } else {
                setAlert({ type: 'error', message: 'Unable to use this file.' });
            }
            return;
        }

        const file = acceptedFiles[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === 'string' ? reader.result : null;

            if (result) {
                setSourceImage(result);
                setPreviewImage(result);
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: ACCEPTED_TYPES,
        multiple: false,
        maxSize: MAX_FILE_SIZE,
        onDrop
    });

    const handleUploadImage = async (event: React.FormEvent) => {
        event.preventDefault();
        setAlert(null);

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setAlert({ type: 'error', message: 'You need to be logged in to change avatar.' });
            return;
        }

        if (!sourceImage || !croppedAreaPixels) {
            setAlert({ type: 'warning', message: 'Please upload and crop an image first.' });
            return;
        }

        try {
            setIsSaving(true);
            const croppedImageDataUrl = await getCroppedImageDataUrl(sourceImage, croppedAreaPixels);

            const response = await fetch('http://localhost:5000/account/avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, imageData: croppedImageDataUrl })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setAlert({ type: 'error', message: data.message || 'Failed to upload avatar.' });
                return;
            }

            setPreviewImage(data.avatarUrl);
            onAvatarUpdated?.(data.avatarUrl);
            window.dispatchEvent(
                new CustomEvent('avatar-updated', {
                    detail: { avatarUrl: data.avatarUrl }
                })
            );
            setAlert({ type: 'success', message: 'Avatar updated successfully.' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Backend server not reached.' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <SectionLayout sectionTitle='Change Avatar' buttonAtBottom>
            {alertVar && <AlertContainer type={alertVar.type} message={alertVar.message} />}

            <form id='avatar-form' onSubmit={handleUploadImage} className='space-y-6'>
                <div className='space-y-3'>
                    <h3 className='text-lg font-semibold'>1. Choose an avatar</h3>
                    <div
                        {...getRootProps()}
                        className={`w-full border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
                            isDragActive ? 'border-red-500 bg-zinc-800' : 'border-zinc-600 bg-zinc-800/60 hover:border-zinc-500'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <p className='text-gray-300'>Drag & drop your image here, or click to upload</p>
                        <p className='text-sm text-gray-400 mt-2'>Supported: JPG, PNG, WEBP • Max size: 5MB</p>
                    </div>
                </div>

                <div className='space-y-3'>
                    <h3 className='text-lg font-semibold'>2. Prepare your image</h3>
                    <div className='relative w-full h-55 rounded-lg overflow-hidden bg-black'>
                        {sourceImage ? (
                            <Cropper
                                image={sourceImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-300'>
                                Choose a new avatar above
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <ConfirmButton text={isSaving ? 'Saving...' : 'Save Avatar'} type='submit' form='avatar-form' />
        </SectionLayout>
    )
}

export default AvatarSection