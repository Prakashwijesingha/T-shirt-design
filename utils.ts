/**
 * Converts an SVG DOM element to a Base64 PNG data URL.
 * This allows us to send the visual design to the Gemini API.
 */
export const svgToPngBase64 = (svgElement: SVGSVGElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Get the bounding box of the SVG to set canvas size
      const bbox = svgElement.getBoundingClientRect();
      const scale = 2; // Upscale for better quality
      canvas.width = bbox.width * scale;
      canvas.height = bbox.height * scale;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const img = new Image();
      // We need to encode the SVG string to be safe for data URI
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = '#ffffff'; // White background ensures transparency doesn't look weird
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngDataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        
        // Remove the "data:image/png;base64," prefix for the API
        const base64Data = pngDataUrl.split(',')[1];
        resolve(base64Data);
      };

      img.onerror = (e) => {
        reject(e);
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};