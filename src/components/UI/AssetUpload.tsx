import { useRef } from 'react';
import { processImageFile, processAudioFile } from '../../utils/assetHelpers';
import { useEditorStore } from '../../stores/editorStore';

interface AssetUploadProps {
  type: 'image' | 'audio';
  onUpload?: (assetUrl: string, assetName: string) => void;
}

export function AssetUpload({ type, onUpload }: AssetUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImage, addAudio } = useEditorStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'image') {
        const asset = await processImageFile(file);
        addImage(asset);
        onUpload?.(asset.url, asset.name);
      } else {
        const asset = await processAudioFile(file);
        addAudio(asset);
        onUpload?.(asset.url, asset.name);
      }
    } catch (error) {
      alert(`Error uploading file: ${(error as Error).message}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const acceptedFormats = type === 'image' ? 'image/*' : 'audio/*';

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
      >
        Upload {type === 'image' ? 'Image' : 'Audio'}
      </button>
    </div>
  );
}
