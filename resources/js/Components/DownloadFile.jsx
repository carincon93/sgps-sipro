import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileTypeIcon from '@/Components/FileTypeIcon'

import { Button } from '@mui/material'

const DownloadFile = ({ downloadRoute = '', filename = '', extension = '', onDelete, className, label = '', ...props }) => {
    return (
        <div className={`flex items-center justify-center border p-4 hover:bg-gray-50 rounded shadow-lg mb-2 relative ${className}`}>
            {downloadRoute ? (
                <a href={downloadRoute} target="_blank" className="flex items-center">
                    <FileTypeIcon fileType={extension} className="!w-6 mr-4" />
                    <FileDownloadIcon className="mr-2" />
                    {filename + '.' + extension}
                </a>
            ) : (
                <>Debe cargar: {label}</>
            )}
            {onDelete && (
                <Button className="!absolute right-1 !bg-white shadow !pl-4 !text-xs" onClick={() => onDelete()} type="button">
                    Eliminar
                </Button>
            )}
        </div>
    )
}

export default DownloadFile
