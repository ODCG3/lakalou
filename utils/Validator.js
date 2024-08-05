export default function validateName(name) {
    const nameRegex = /^(?!\s*$)[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return nameRegex.test(name);
}

export function validateImageExtension(filename) {
    const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i;
    return imageExtensionRegex.test(filename);
}