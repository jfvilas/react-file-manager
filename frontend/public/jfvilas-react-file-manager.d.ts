declare module '@jfvilas/react-file-manager' {
    import React, { FC } from 'react'

    export interface IError {
        type: string,
        message: string,
        response: {
            status: number,
            statusText: string,
            data: any,
        }
    }

    export interface IFileData {
        name: string
        isDirectory: boolean
        path: string
        updatedAt?: string
        size?: number
        class?: string
    }

    export interface IAction {
        title: string,
        icon: React.ReactNode,
        onClick: (files : any) => void
    }

    export interface IIcon {
        open: React.ReactNode
        closed: React.ReactNode
        grid: React.ReactNode
        list: React.ReactNode
        default: React.ReactNode
    }

    export interface IFileUploadConfig {
        url: string
        method?: "POST" | "PUT"
        headers?: { [key: string]: string }
    }

    export interface IPermissions {
        create?: boolean
        upload?: boolean
        move?: boolean
        copy?: boolean
        rename?: boolean
        download?: boolean
        delete?: boolean
    }

    const FileManager : FC<{
        actions?: Map<string, IAction[]>,
        files?: IFileData[],
        fileUploadConfig : IFileUploadConfig,
        icons: Map<string, IIcon[]>,
        isLoading?: boolean,
        onCreateFolder : (name: string, parentFolder: IFileData) => void,
        onFileUploading : (file:IFileData, parentFolder: IFileData) => void,
        onFileUploaded? : () => void,
        onCut? : (files: Array<IFileData>) => void,
        onCopy? : (files: Array<IFileData>) => void,
        onPaste : (files: Array<IFileData>, destFolder:IFileData, operation:string) => void,
        onRename : (file: IFileData, newName: string) => void,
        onDownload : (files: Array<IFileData>) => void,
        onDelete : (files:IFileData[]) => void,
        onLayoutChange? : () => void,
        onRefresh : () => void,
        onFileOpen? : () => void,
        onFolderChange : (folder: string) => void,
        onSelect? : (files:IFileData[]) => void,
        onSelectionChange? : (files:IFileData[]) => void,
        onError? : (error: IError, file: IFileData) => void,
        layout?: string,
        enableFilePreview : boolean,
        maxFileSize? : number,
        filePreviewPath : string,
        acceptedFileTypes? : string,
        height : string,
        width? : string,
        initialPath : string,
        filePreviewComponent? : React.ReactNode,
        primaryColor : string,
        fontFamily : string,
        language? : string,
        permissions : IPermissions,
        collapsibleNav? : boolean,
        defaultNavExpanded? : boolean,
        className? : string,
        style? : any,
        formatDate? : string | number
    }>
   
}