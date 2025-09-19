import { useState, useCallback } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DisplayFile {
  id: string
  name: string
  size: number
  type: string
}

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function FileUpload({ 
  onFilesUploaded, 
  maxFiles = 10, 
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'] 
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<DisplayFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return
    
    const newFiles: File[] = []
    for (let i = 0; i < files.length && uploadedFiles.length + newFiles.length < maxFiles; i++) {
      const file = files[i]
      newFiles.push(file)
    }
    
    // Convert to display format for UI
    const displayFiles: DisplayFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type
    }))
    
    const updatedFiles = [...uploadedFiles, ...displayFiles]
    setUploadedFiles(updatedFiles)
    onFilesUploaded(newFiles)
  }, [uploadedFiles, maxFiles, onFilesUploaded])

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(updatedFiles)
    // Note: This doesn't re-upload, just updates display
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Upload Research Documents</h3>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            handleFileSelect(e.dataTransfer.files)
          }}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports: {acceptedTypes.join(', ')} • Max {maxFiles} files
          </p>
          <Button variant="outline" asChild data-testid="button-browse-files">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Uploaded Files ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  data-testid={`file-item-${file.id}`}
                >
                  <div className="flex items-center gap-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    data-testid={`button-remove-file-${file.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}