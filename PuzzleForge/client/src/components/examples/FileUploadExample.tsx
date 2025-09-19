import { FileUpload } from '../FileUpload'

export default function FileUploadExample() {
  const handleFilesUploaded = (files: any[]) => {
    console.log('Files uploaded:', files)
  }
  
  return (
    <div className="p-6 max-w-2xl">
      <FileUpload onFilesUploaded={handleFilesUploaded} />
    </div>
  )
}