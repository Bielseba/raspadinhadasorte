// imageManager.js - Gerenciador de uploads de imagem
class ImageManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindImageUploadEvents();
        this.bindColorPickerEvents();
    }

    bindImageUploadEvents() {
        // Upload de logo
        this.setupImageUpload('logo-upload', 'logo-file-name', 'logo-upload-preview', 'logo-upload-img', 'logo-upload-progress', 'logo-upload-progress-bar', 'logo-url', 'logo-preview');
        
        // Upload de banners
        this.setupImageUpload('banner-1-upload', 'banner-1-file-name', 'banner-1-upload-preview', 'banner-1-upload-img', 'banner-1-upload-progress', 'banner-1-upload-progress-bar', 'banner-1-url', 'banner-1-preview');
        this.setupImageUpload('banner-2-upload', 'banner-2-file-name', 'banner-2-upload-preview', 'banner-2-upload-img', 'banner-2-upload-progress', 'banner-2-upload-progress-bar', 'banner-2-url', 'banner-2-preview');
        this.setupImageUpload('banner-3-upload', 'banner-3-file-name', 'banner-3-upload-preview', 'banner-3-upload-img', 'banner-3-upload-progress', 'banner-3-upload-progress-bar', 'banner-3-url', 'banner-3-preview');
        
        // Upload de imagem de raspadinha
        this.setupImageUpload('sc-image-upload', 'sc-image-file-name', 'sc-image-upload-preview', 'sc-image-upload-img', 'sc-image-upload-progress', 'sc-image-upload-progress-bar', 'sc-image');
    }

    bindColorPickerEvents() {
        // Sincronizar color picker com input de texto
        const colorPickers = document.querySelectorAll('input[type="color"]');
        colorPickers.forEach(picker => {
            const textInput = picker.nextElementSibling;
            if (textInput && textInput.type === 'text') {
                picker.addEventListener('change', (e) => {
                    textInput.value = e.target.value;
                });
                
                textInput.addEventListener('input', (e) => {
                    if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                        picker.value = e.target.value;
                    }
                });
            }
        });
    }

    setupImageUpload(inputId, fileNameId, previewId, previewImgId, progressId, progressBarId, urlInputId, previewElementId) {
        const fileInput = document.getElementById(inputId);
        const fileName = document.getElementById(fileNameId);
        const previewContainer = document.getElementById(previewId);
        const previewImg = document.getElementById(previewImgId);
        const progressContainer = document.getElementById(progressId);
        const progressBar = document.getElementById(progressBarId);
        const urlInput = document.getElementById(urlInputId);
        const previewElement = document.getElementById(previewElementId);

        if (!fileInput) return;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelection(file, fileName, previewContainer, previewImg, progressContainer, progressBar, urlInput, previewElement, inputId);
            }
        });
    }

    handleFileSelection(file, fileName, previewContainer, previewImg, progressContainer, progressBar, urlInput, previewElement, inputType) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
            return;
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        // Mostrar nome do arquivo
        fileName.textContent = file.name;

        // Preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Fazer upload
        this.uploadImage(file, inputType, progressContainer, progressBar, urlInput, previewElement);
    }

    async uploadImage(file, inputType, progressContainer, progressBar, urlInput, previewElement) {
        try {
            // Validar arquivo
            if (!this.validateImageFormat(file)) {
                this.showNotification('Formato de arquivo não suportado. Use JPG, PNG, GIF ou WebP.', 'error');
                return;
            }

            // Mostrar progresso
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';

            let result;
            
            // Determinar tipo de upload baseado no inputType
            if (inputType.includes('logo')) {
                result = await window.app.uploadLogo(file);
            } else if (inputType.includes('banner')) {
                const bannerNumber = inputType.match(/\d+/)?.[0] || '1';
                result = await window.app.uploadBanner(file, bannerNumber);
            } else if (inputType.includes('scratchcard')) {
                result = await window.app.uploadScratchcardImage(file);
            } else {
                result = await window.app.uploadPrizeImage(file);
            }

            // Simular progresso (em uma implementação real, isso viria do XMLHttpRequest)
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 50));
                progressBar.style.width = i + '%';
            }

            // Atualizar URL e preview
            if (result && result.imageUrl) {
                urlInput.value = result.imageUrl;
                if (previewElement) {
                    previewElement.src = result.imageUrl;
                    previewElement.style.display = 'block';
                }
                this.showNotification('Imagem enviada com sucesso!', 'success');
            } else {
                throw new Error('Resposta inválida do servidor');
            }

        } catch (error) {
            console.error('Erro no upload:', error);
            this.showNotification(`Erro no upload: ${error.message}`, 'error');
        } finally {
            // Ocultar progresso após um tempo
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
            }, 2000);
        }
    }

    showNotification(message, type = 'info') {
        // Criar notificação visual temporária
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            background-color: ${type === 'success' ? '#1db954' : type === 'error' ? '#e53935' : '#f5b942'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Método para limpar uploads
    clearUpload(inputId) {
        const fileInput = document.getElementById(inputId);
        const fileName = document.getElementById(inputId.replace('-upload', '-file-name'));
        const previewContainer = document.getElementById(inputId.replace('-upload', '-upload-preview'));
        const progressContainer = document.getElementById(inputId.replace('-upload', '-upload-progress'));

        if (fileInput) fileInput.value = '';
        if (fileName) fileName.textContent = '';
        if (previewContainer) previewContainer.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
    }

    // Método para validar formato de imagem
    validateImageFormat(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return allowedTypes.includes(file.type);
    }

    // Método para redimensionar imagem se necessário
    resizeImage(file, maxWidth = 800, maxHeight = 600) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let { width, height } = img;
                
                // Calcular novas dimensões mantendo proporção
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ImageManager();
});

export default ImageManager;
