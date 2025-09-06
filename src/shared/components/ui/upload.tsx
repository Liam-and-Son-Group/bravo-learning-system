import {
  User,
  Upload,
  X,
  Check,
  AlertCircle,
  type LucideIcon,
  File,
} from "lucide-react";
import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from "react";

// Type definitions
export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarVariant = "circle" | "square" | "rounded";
export type BorderStyle = "solid" | "dashed";

export interface FileData {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface SizeConfig {
  container: string;
  text: string;
  icon: string;
}

export interface AvatarUploaderProps {
  // Core props
  value?: File | null;
  onChange?: (file: File | null, preview: string | null) => void;

  // Appearance props
  size?: AvatarSize;
  variant?: AvatarVariant;

  // Behavior props
  maxSize?: number; // MB
  acceptedTypes?: string[];

  // Content props
  placeholder?: string;
  hoverText?: string;
  emptyIcon?: LucideIcon;
  uploadIcon?: LucideIcon;

  // Status props
  error?: string | null;
  disabled?: boolean;
  required?: boolean;

  // Style props
  className?: string;
  borderStyle?: BorderStyle;

  // Callback props
  onError?: (error: string) => void;
  onRemove?: () => void;

  // Additional props
  showRemoveButton?: boolean;
  showPreview?: boolean;
  allowRemove?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  // Core props
  value = null,
  onChange = () => {},

  // Appearance props
  size = "lg",
  variant = "circle",

  // Behavior props
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],

  // Content props
  placeholder = "Upload",
  hoverText = "Change",
  emptyIcon = File,
  uploadIcon = Upload,

  // Status props
  error = null,
  disabled = false,
  required = false,

  // Style props
  className = "",
  borderStyle = "dashed",

  // Callback props
  onError = () => {},
  onRemove = () => {},

  // Additional props
  showRemoveButton = true,
  showPreview = true,
  allowRemove = true,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeConfig: Record<AvatarSize, SizeConfig> = {
    sm: { container: "h-16 w-16", text: "text-xs", icon: "w-4 h-4" },
    md: { container: "h-20 w-20", text: "text-xs", icon: "w-5 h-5" },
    lg: { container: "h-24 w-24", text: "text-xs", icon: "w-6 h-6" },
    xl: { container: "h-32 w-32", text: "text-xs", icon: "w-8 h-8" },
  };

  // Variant styles
  const variantStyles: Record<AvatarVariant, string> = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  const currentSize: SizeConfig = sizeConfig[size];
  const EmptyIcon: LucideIcon = emptyIcon;
  const UploadIcon: LucideIcon = uploadIcon;

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    if (!acceptedTypes.includes(file.type)) {
      errors.push("File type not supported");
    }

    if (file.size > maxSize * 1024 * 1024) {
      errors.push(`File size must be less than ${maxSize}MB`);
    }

    return errors;
  };

  const handleFileSelect = (file: File): void => {
    if (!file) return;

    const validationErrors = validateFile(file);
    if (validationErrors.length > 0) {
      onError(validationErrors[0]);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = event.dataTransfer?.files;
    if (files?.length && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleClick = (): void => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null, null);
    onRemove();
  };

  const getBorderColor = (): string => {
    if (error) return "border-red-400 hover:border-red-500";
    if (isDragging) return "border-blue-500";
    if (isHovered) return "border-blue-400";
    if (preview) return "border-green-400";
    return "border-gray-300 hover:border-gray-400";
  };

  const getBackgroundColor = (): string => {
    if (error) return "bg-red-50";
    if (isDragging) return "bg-blue-50";
    if (preview) return "bg-green-50";
    return "bg-gray-50 hover:bg-gray-100";
  };

  return (
    <div className={`flex flex-col items-center  space-y-2 ${className}`}>
      {/* Main upload area */}
      <div className="relative group">
        <div
          className={`
          relative cursor-pointer transition-all duration-300 overflow-hidden
          ${currentSize.container}
          ${variantStyles[variant]}
          ${borderStyle === "dashed" ? "border-dashed" : "border-solid"}
          border-[2px] ${getBorderColor()} ${getBackgroundColor()}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
          ${isDragging ? "scale-105" : ""}
          flex items-center justify-center group
        `}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => {
            setIsDragging(false);
            setIsHovered(false);
          }}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          {/* Preview image */}
          {preview && showPreview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover m-2"
            />
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center space-y-1 p-2">
              <div
                className={`transition-all duration-300 ${
                  isHovered || isDragging
                    ? "text-blue-500 transform scale-110"
                    : "text-gray-400"
                }`}
              >
                {isHovered || isDragging ? (
                  <UploadIcon className={currentSize.icon} />
                ) : (
                  <EmptyIcon className={currentSize.icon} />
                )}
              </div>

              <span
                className={`
              ${
                currentSize.text
              } text-center font-medium transition-all duration-300
              ${isHovered || isDragging ? "text-blue-600" : "text-gray-500"}
            `}
              >
                {isHovered || isDragging ? hoverText : placeholder}
              </span>
            </div>
          )}
        </div>
        {/* Loading/Success indicator */}
        {preview && (
          <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        )}

        {/* Remove button */}
        {preview && showRemoveButton && allowRemove && !disabled && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-1 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* File info */}
      {preview && value && (
        <div className="text-center">
          <p className="text-xs text-gray-500">{value.name}</p>
          <p className="text-xs text-gray-400">
            {(value.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-400 text-center">
        {acceptedTypes
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")}{" "}
        up to {maxSize}MB
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
    </div>
  );
};
