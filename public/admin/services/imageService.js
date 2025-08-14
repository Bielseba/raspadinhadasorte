// imageService.js
import { apiRequest, API_BASE_URL } from '../utils/api.js';

export async function uploadImage(file, type = 'scratchcard') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/upload-image`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Erro no upload da imagem');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
    }
}

export async function deleteImage(imageUrl, token) {
    return apiRequest('/admin/delete-image', 'DELETE', { imageUrl }, token);
}

export function previewImage(input, previewElement) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
