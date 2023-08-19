import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileTypeIcon from '@/Components/FileTypeIcon'

import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileUploadImage from '@/Components/FileUploadIcon'
import FolderDeleteIcon from '@mui/icons-material/FolderDelete'

import { Button, Chip, FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { useState, useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
}))

const FileInput = ({ onChange, value = '', error = '', id = '', label = 'Seleccione un archivo', downloadRoute = '', accept = '', filename = '', extension = '', onDelete, ...props }) => {
    const classes = useStyles()

    const [fileType, setFileType] = useState('')

    useEffect(() => {
        setFileType(value?.type)
    }, [value])

    return (
        <div>
            <input accept={accept} className={classes.input} id={id} multiple={false} type="file" onChange={onChange} />
            <label htmlFor={id} className="p-4 block bg-gray-100 hover:bg-gray-50 text-center hover:cursor-pointer">
                <FileUploadImage className="w-28 mx-auto mb-4" />
                {value == null ? (
                    <>
                        <span className="bg-app-900 rounded shadow text-white pl-4 pr-3 pt-2 pb-3 mr-2 inline-block mb-2">Seleccione el archivo: </span>
                        {label}
                    </>
                ) : (
                    <Chip className="!bg-green-100 shadow !text-green-600" label="Pendiente de ser cargado" />
                )}
            </label>
            {value && (
                <div className="flex items-center justify-center border-t-2 p-4 bg-gray-100 hover:bg-gray-50">
                    <FileTypeIcon fileType={fileType} id={id} className="!w-10" />
                    <p className="ml-4">
                        <FileUploadIcon /> {value.name}
                    </p>
                </div>
            )}
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}

            {downloadRoute && value == null && (
                <div className="flex items-center justify-center border p-4 hover:bg-gray-50 rounded shadow mb-2 relative">
                    <a href={downloadRoute} target="_blank" className="flex items-center">
                        <FileTypeIcon fileType={extension} id={id} className="!w-10 mr-4" />
                        <FileDownloadIcon className="mr-2" />
                        {filename + '.' + extension}
                    </a>
                    {onDelete && (
                        <Button className="!absolute right-1" onClick={() => onDelete()} type="button">
                            Eliminar
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export default FileInput
