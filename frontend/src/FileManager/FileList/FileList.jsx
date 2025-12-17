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

const FileList = ({
    actions,
    space,
    spaces,
    icons,
    filter,
    filterRegex,
    filterCasing,
    onCreateFolder,
    onRename,
    onFileOpen,
    onRefresh,
    enableFilePreview,
    triggerAction,
    permissions,
    formatDate
    }) => {

    const { currentPathFiles, sortConfig, setSortConfig, currentFolder } = useFileNavigation()
    const filesViewRef = useRef(null)
    const { activeLayout, setActiveLayout } = useLayout()
    const t = useTranslation()
    const { options } = useOptions()
    
    if (currentFolder && currentFolder.children) {
        space = currentFolder.children
        //if (currentFolder.layout && currentFolder.layout !== activeLayout) setActiveLayout(currentFolder.layout)
    }

    const {
        emptySelecCtxItems,
        selecCtxItems,
        handleContextMenu,
        unselectFiles,
        visible,
        setVisible,
        setLastSelectedFile,
        selectedFileIndexes,
        clickPosition,
        isSelectionCtx,
    } = useFileList(onRefresh, enableFilePreview, triggerAction, permissions, onFileOpen, space, spaces)

    const contextMenuRef = useDetectOutsideClick(() => setVisible(false))

    const applyFilter = (f) => {
        if (filter!=='') {
            if (filterCasing) {
                if (filterRegex) {
                    try {
                        const regex=new RegExp(filter)
                        if (!regex.test(f.name)) return false
                    }
                    catch { return false }
                }
                else {
                    if (!f.name.includes(filter)) return false
                }
            }
            else {
                if (filterRegex) {
                    try {
                        const regex=new RegExp(filter.toLocaleLowerCase())
                        if (!regex.test(f.name.toLocaleLowerCase())) return false
                    }
                    catch { 
                        return false 
                    }
                }
                else {
                    if (!f.name.toLocaleLowerCase().includes(filter.toLowerCase())) return false
                }
            }
        }
        return true
    }

    const handleSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc"
        setSortConfig({ key, direction })
    }

    const customActionClick = (src)=> {
        setVisible(false)
        if (actions) {
            for (let actionKey of actions.keys()) {
                let allSameClass = (selectedFileIndexes.length>0) && selectedFileIndexes.every(i => currentPathFiles[i].class===actionKey)
                if (allSameClass) {
                    for (let customAction of actions.get(actionKey)) {
                        if (customAction.title === src.target.innerText) {
                            let selectedFiles=currentPathFiles.filter ( (f,i) => selectedFileIndexes.includes(i))
                            customAction.onClick(selectedFiles)
                        }
                    }
                }
            }
        }
    }

    let contextItems = selecCtxItems
    if (actions) {
        for (let actionKey of actions.keys()) {
            let allSameClass = (selectedFileIndexes.length>0) && selectedFileIndexes.every(i => currentPathFiles[i].class===actionKey)
            if (allSameClass) {
                contextItems[contextItems.length-1].divider=true
                for (let customAction of actions.get(actionKey)) {
                    contextItems.push({
                        title:customAction.title,
                        icon:customAction.icon,
                        divider:customAction.divider,
                        onClick:customActionClick
                    })
                }
            }
        }
    }

    const renderStatusBar = () => {
        if (!options.statusBar) return <></>

        let list = currentPathFiles.filter (f => applyFilter(f))        
        let text=list.length + ' Items'
        if (selectedFileIndexes.length>0) {
            text+= '\u00A0\u00A0\u00A0\u00A0' + selectedFileIndexes.length +'\u00A0items selected'
            let files = list.filter ((file,i) => selectedFileIndexes.includes(i)) 
            let size = files.reduce((acc,file) => {
                return (file[spaces.get(space).sumSourceProperty]||0)+acc
            },0)
            text+= '\u00A0\u00A0\u00A0\u00A0' + getObjectSize(spaces.get(space), size)
        }

        return (
            <div className="statusbar" style={{...(!options.folderTree? {borderBottomLeftRadius: '8px'} : {})}}>{text}</div>
        )
    }

    if (currentFolder && currentFolder.layout==='own' && currentFolder.children && typeof currentFolder.children === 'function') {
        return (<>
            <div className='files' style={{paddingRight:0}}></div>
                <>{currentFolder.children()}</>
            </>)
    }
    else {
        return <>
        {
            <>
                <div className='files list' style={{paddingRight:0}}>
                    {activeLayout === "list" && (
                        <FilesHeader space={space} spaces={spaces} unselectFiles={unselectFiles} onSort={handleSort} sortConfig={sortConfig} />
                    )}
                </div>

                <div
                    ref={filesViewRef}
                    className={`files ${activeLayout}`}
                    style={{height: (options.statusBar? `calc(100% - (${activeLayout==='list'?82:55}px))`:`calc(100% - (${activeLayout==='list'?60:35}px))`), borderBottom: (options.statusBar?1:0)}}
                    onContextMenu={handleContextMenu}
                    onClick={unselectFiles}
                >

                    {currentPathFiles?.length > 0 ? (
                        <>
                            {currentPathFiles.map((file, index) => (
                            applyFilter(file) && <FileItem
                                key={index}
                                space={space}
                                spaces={spaces}
                                icons={icons}
                                index={index}
                                file={file}
                                onCreateFolder={onCreateFolder}
                                onRename={onRename}
                                onFileOpen={onFileOpen}
                                enableFilePreview={enableFilePreview}
                                triggerAction={triggerAction}
                                filesViewRef={filesViewRef}
                                selectedFileIndexes={selectedFileIndexes}
                                handleContextMenu={handleContextMenu}
                                setVisible={setVisible}
                                setLastSelectedFile={setLastSelectedFile}
                                draggable={permissions.move}
                                formatDate={formatDate}
                            />
                            ))}
                        </> 
                    )
                    :
                    (
                        <div className="empty-folder">{t("folderEmpty")}</div>
                    )}

                    <ContextMenu
                        filesViewRef={filesViewRef}
                        contextMenuRef={contextMenuRef.ref}
                        menuItems={isSelectionCtx ? contextItems : emptySelecCtxItems}
                        visible={visible}
                        setVisible={setVisible}
                        clickPosition={clickPosition}
                    />
                </div>
                {renderStatusBar()}
            </>
        }
        </>
    }
}

FileList.displayName = "FileList";

export default FileList;
