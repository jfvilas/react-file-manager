import { useRef } from "react"
import FileItem from "./FileItem"
import { useFileNavigation } from "../../contexts/FileNavigationContext"
import { useLayout } from "../../contexts/LayoutContext"
import { useOptions } from "../../contexts/OptionsContext"
import ContextMenu from "../../components/ContextMenu/ContextMenu"
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick"
import useFileList from "./useFileList"
import FilesHeader from "./FilesHeader"
import { useTranslation } from "../../contexts/TranslationProvider"
import { getObjectSize } from '../../utils/getObjectSize'
import "./FileList.scss"

const Content = ({
    actions,
    space,
    spaces,
    icons,
    filter,
    onCreateFolder,
    onRename,
    onFileOpen,
    onRefresh,
    enableFilePreview,
    triggerAction,
    permissions,
    formatDate
    }) => {

    const { currentFolder } = useFileNavigation()

    if (currentFolder) {
        switch (currentFolder.layout) {
            case 'own':
                return currentFolder.children
            case 'list':
            case 'grid':
                console.log(currentFolder.layout)
                return <FileList 
                    actions={actions}
                    space={space}
                    spaces={spaces}
                    icons={icons}
                    onCreateFolder={onCreateFolder}
                    onRename={onRename}
                    onFileOpen={onFileOpen}
                    onRefresh={onRefresh}
                    enableFilePreview={enableFilePreview}
                    triggerAction={triggerAction}
                    permissions={permissions}
                    formatDate={formatDate}
                    filter={filter}
                />
        }
    }
}

FileList.displayName = "Content";

export default Content;
