import { useRef } from "react";
import FileItem from "./FileItem";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useLayout } from "../../contexts/LayoutContext";
import { useOptions } from "../../contexts/OptionsContext";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./FileList.scss";

const FileList = ({
  actions,
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
  const { currentPathFiles, sortConfig, setSortConfig } = useFileNavigation();
  const filesViewRef = useRef(null)
  const { activeLayout } = useLayout()
  const t = useTranslation()
  const { options } = useOptions()

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
  } = useFileList(onRefresh, enableFilePreview, triggerAction, permissions, onFileOpen)

  const contextMenuRef = useDetectOutsideClick(() => setVisible(false))

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

    let text=currentPathFiles.length + ' Items'
    if (selectedFileIndexes.length>0) {
      text+= '\u00A0\u00A0\u00A0\u00A0' + selectedFileIndexes.length +'\u00A0items selected'
      let size = currentPathFiles.filter ((f,i) => selectedFileIndexes.includes(i)).reduce((a,c) => {
        return (c.size||0)+a
      },0)
      var units = 'bytes'
      if (size>1024) {
        size = (size/1024).toFixed(0)
        units='KB'
        if (size >1024) {
          size = (size/1024).toFixed(0)
          units='MB'
        }
      }
      text+= '\u00A0\u00A0\u00A0\u00A0' + size + '\u00A0' + units
    }

    return (
      <div className="statusbar">{text}</div>
    )
  }

  return (
    <>
      <div
        ref={filesViewRef}
        className={`files ${activeLayout}`}
        style={{height: (options.statusBar? 'calc(100% - (54px))':'calc(100% - (35px))'), borderBottom: (options.statusBar?1:0)}}
        onContextMenu={handleContextMenu}
        onClick={unselectFiles}
      >
        {activeLayout === "list" && (
          <FilesHeader unselectFiles={unselectFiles} onSort={handleSort} sortConfig={sortConfig} />
        )}

        {currentPathFiles?.length > 0 ? (
          <>
            {currentPathFiles.filter(f => f.name.toLowerCase().includes(filter)).map((file, index) => (
              <FileItem
                key={index}
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

  )
}

FileList.displayName = "FileList";

export default FileList;
