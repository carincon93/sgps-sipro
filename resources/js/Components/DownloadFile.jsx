import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileTypeIcon from '@/Components/FileTypeIcon'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Button } from '@mui/material'

const DownloadFile = ({ downloadRoute = '', filename = '', extension = '', onDelete, className, label = '', required = true, ...props }) => {
    return (
        <div className={`flex items-center justify-center border p-4 rounded shadow-lg relative ${className} ${!downloadRoute ? 'text-red-500 bg-red-100' : ''}`}>
            {downloadRoute ? (
                <a href={downloadRoute} target="_blank" className="flex items-center">
                    <FileTypeIcon fileType={extension.split('?')[0]} className="!w-6 mr-4" />
                    <FileDownloadIcon className="mr-2" />
                    {filename.slice(0, 20) + '.' + extension.split('?')[0]}
                </a>
            ) : required ? (
                <>
                    <ErrorOutlineIcon className="mr-2" /> Debe cargar: {label}
                </>
            ) : (
                <>No se ha cargado ningun archivo.</>
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
