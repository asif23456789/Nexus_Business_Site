import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, Smartphone, Tablet } from 'lucide-react';
import { Document } from '../../types/document';

interface SignaturePadProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string) => void;
  document: Document | null;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  isOpen,
  onClose,
  onSign,
  document,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size based on device
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth * (isMobile ? 2 : 1.5); // Retina scaling for mobile
          canvas.height = isMobile ? 280 : isTablet ? 320 : 256;
        }
        
        // Adjust line width for touch devices
        const lineWidth = isMobile ? 3 : isTablet ? 2.5 : 2;
        
        // Set drawing style
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, isMobile, isTablet]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? (e.touches[0].clientX - rect.left) * (canvas.width / rect.width)
      : (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = 'touches' in e 
      ? (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
      : (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
    
    // Prevent scrolling on mobile while drawing
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? (e.touches[0].clientX - rect.left) * (canvas.width / rect.width)
      : (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = 'touches' in e 
      ? (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
      : (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Prevent scrolling on mobile while drawing
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    // Convert canvas to base64 image
    const signatureData = canvas.toDataURL('image/png');
    onSign(signatureData);
    clearSignature();
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Modal Container - Responsive sizing */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto my-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Sign Document</h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">{document.title}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Device indicator (optional, for debugging) */}
            {isMobile && <Smartphone className="w-4 h-4 text-gray-400" />}
            {isTablet && <Tablet className="w-4 h-4 text-gray-400" />}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-900">
              {isMobile ? 'Sign using your finger. Press and drag in the box below.' 
               : 'Please sign in the box below using your mouse or touchscreen.'}
            </p>
          </div>

          {/* Signature Canvas Container */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair touch-none"
              style={{
                height: isMobile ? '280px' : isTablet ? '320px' : '256px'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
          </div>

          {/* Canvas Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <span className="text-xs sm:text-sm">Draw your signature above</span>
            <button
              onClick={clearSignature}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Clear Signature</span>
            </button>
          </div>

          {/* Legal Notice - Collapsible on mobile */}
          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-xs sm:text-sm font-medium text-yellow-900">
                  Legal Notice
                </span>
                <span className="text-yellow-700 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-xs text-yellow-900 mt-2 pt-2 border-t border-yellow-200">
                By signing this document electronically, you agree that your electronic signature is the legal equivalent of your manual signature on this document.
              </p>
            </details>
          </div>

          {/* Document Preview Info - Stack on mobile, grid on larger */}
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Document Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
              <div>
                <strong className="text-gray-700">Title:</strong>
                <p className="truncate">{document.title}</p>
              </div>
              {document.description && (
                <div className="sm:col-span-2">
                  <strong className="text-gray-700">Description:</strong>
                  <p className="line-clamp-2">{document.description}</p>
                </div>
              )}
              <div>
                <strong className="text-gray-700">Type:</strong>
                <p>{document.fileType.toUpperCase()}</p>
              </div>
              <div>
                <strong className="text-gray-700">Category:</strong>
                <p>{document.category || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Actions - Stack on mobile, row on larger */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isEmpty}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
            >
              <Check className="w-4 h-4" />
              <span>Sign Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;