import { useRef } from "react";
import FileItem from "./FileItem";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useLayout } from "../../contexts/LayoutContext";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./FileList.scss";

const FileList = ({
  actions,
  onCreateFolder,
  onRename,
  onFileOpen,
  onRefresh,
  enableFilePreview,
  triggerAction,
  permissions,
  formatDate,
}) => {
  const { currentPathFiles, sortConfig, setSortConfig } = useFileNavigation();
  const filesViewRef = useRef(null);
  const { activeLayout } = useLayout();
  const t = useTranslation();

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
  } = useFileList(onRefresh, enableFilePreview, triggerAction, permissions, onFileOpen);

  const contextMenuRef = useDetectOutsideClick(() => setVisible(false));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const customActionClick = (src)=> {
    setVisible(false)
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

  let contextItems = selecCtxItems
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

  return (
    <div
      ref={filesViewRef}
      className={`files ${activeLayout}`}
      onContextMenu={handleContextMenu}
      onClick={unselectFiles}
    >
      {activeLayout === "list" && (
        <FilesHeader unselectFiles={unselectFiles} onSort={handleSort} sortConfig={sortConfig} />
      )}

      {currentPathFiles?.length > 0 ? (
        <>
          {currentPathFiles.map((file, index) => (
            <FileItem
              key={index}
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
      ) : (
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
  );
};

FileList.displayName = "FileList";

export default FileList;
