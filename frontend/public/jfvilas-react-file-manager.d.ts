declare module '@jfvilas/react-file-manager' {
    import React from 'react'

    export interface IFileManagerHandle {
        changeFolder: (dest: string) => void
        lock: () => void
        unlock: () => void
    }

    export interface IFileUploadConfig {
        url: string
        method?: "POST" | "PUT"
        headers?: { [key: string]: string }
    }

    export interface IFileDownloadConfig {
        url: string
        headers?: { [key: string]: string }
    }

    export interface IError {
        type: string
        message: string
        response: {
            status: number
            statusText: string
            data: any
        }
    }

    export interface IFileObject {
        name: string
        displayName?: string
        isDirectory: boolean
        path: string
        layout?: string
        class?: string
        children?: string | ((folder: IFileObject) => React.ReactNode)
        data?: any
        categories?: string[]
        features?: string[]
    }

    export interface IAction {
        title: string
        icon?: React.ReactNode
        divider?: boolean
        onClick: (files: IFileObject[]) => void
    }

    export interface IIcon {
        open?: React.ReactNode
        closed?: React.ReactNode
        grid?: React.ReactNode
        list?: React.ReactNode
        default?: React.ReactNode
    }

    export interface ISpace {
        text?: string
        source?: string
        width?: number
        sumSourceProperty?: string
        sumReducer?: number
        sumUnits?: string[]
        leftItems?: ISpaceMenuItem[]
        configurable?: boolean
        properties?: ISpaceProperty[]
    }

    export interface ISpaceMenuItem {
        name?: string
        icon?: React.ReactNode
        text: string
        permission: boolean
        multi?: boolean
        onClick?: (paths: string[], currentTarget: Element) => void
        isVisible?: (name: string, currentFolder: IFileObject, selectedItems: IFileObject[]) => boolean
        isEnabled?: (name: string, currentFolder: IFileObject, selectedItems: IFileObject[]) => boolean
    }

    export interface IFileManagerMenuItem {
        name: string
        onClick?: (name: string, target: HTMLElement) => void
        onDraw?: (name: string) => void
    }

    export interface ISpaceProperty {
        name: string
        text: string
        source: string | ((path: string) => React.ReactNode)
        format: 'string' | 'function' | 'age' | 'number' | 'storage' | 'date' | 'size'
        sortable: boolean
        removable?: boolean
        width: number
        visible: boolean
    }

    export interface ICategoryValue {
        key: string
        text?: string
    }

    export interface ICategory {
        key: string
        text: string
        all: ICategoryValue[]
        selected: string[]
        onCategoryValuesChange: (categoryKey: string, value: string, selected: string[]) => void
        onCategoryFilter: (categoryKey: string, f: IFileObject) => boolean
        isFilterActive: (categoryKey: string) => boolean
    }

    export interface IPermissions {
        create?: boolean
        delete?: boolean
        download?: boolean
        copy?: boolean
        move?: boolean
        rename?: boolean
        upload?: boolean
    }

    export interface IFileManagerProps {
        actions?: Map<string, IAction[]>
        space?: string
        spaces?: Map<string, ISpace>
        rightItems?: IFileManagerMenuItem[]
        files?: IFileObject[]
        fileUploadConfig?: IFileUploadConfig
        fileDownloadConfig?: IFileDownloadConfig
        icons?: Map<string, IIcon>
        isLoading?: boolean
        onCreateFolder?: (name: string, parentFolder: IFileObject) => void
        onFileUploaded?: (file: IFileObject, parentFolder: IFileObject) => void
        onFileUploading?: (file: IFileObject, parentFolder: IFileObject) => void
        onFileUploadError?: (file: IFileObject, parentFolder: IFileObject) => void
        onCut?: (files: IFileObject[]) => void
        onCopy?: (files: IFileObject[]) => void
        onPaste?: (files: IFileObject[], destFolder: IFileObject, operation: string) => void
        onRename?: (file: IFileObject, newName: string) => void
        onDownload?: (files: IFileObject[]) => void
        onDelete?: (files: IFileObject[]) => void
        onLayoutChange?: (layout: "list" | "grid") => void
        onRefresh?: () => void
        onFileOpen?: (file: IFileObject) => void
        onFolderChange?: (folder: string) => void
        onSelect?: (files: IFileObject[]) => void
        onSelectionChange?: (files: IFileObject[]) => void
        onError?: (error: IError, file: IFileObject) => void
        layout?: "list" | "grid"
        enableFilePreview?: boolean
        maxFileSize?: number
        filePreviewPath?: string
        acceptedFileTypes?: string[]
        height?: string | number
        width?: string | number
        initialPath?: string
        filePreviewComponent?: (file: IFileObject) => React.ReactNode
        primaryColor?: string
        fontFamily?: string
        language?: string
        permissions?: IPermissions
        collapsibleNav?: boolean
        defaultNavExpanded?: boolean
        className?: string
        style?: React.CSSProperties
        searchMode?: 'auto' | 'hidden' | 'visible'
        searchRegex?: boolean
        searchCasing?: boolean
        openMode?: 'default' | 'none'
        showRefresh?: boolean
        showContextMenu?: boolean
        showBreadcrumb?: boolean
        categories?: ICategory[]
        maxNavigationPaneLevel?: number
        minFileActionsLevel?: number
        formatDate?: (date: string | Date) => string
    }

    export const FileManager: React.ForwardRefExoticComponent<
        IFileManagerProps & React.RefAttributes<IFileManagerHandle>
    >
}
