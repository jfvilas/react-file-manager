import React, { useEffect, useState } from "react";
import Collapse from "../../components/Collapse/Collapse";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useFileNavigation } from "../../contexts/FileNavigationContext";

const FolderTree = ({ folder, onFileOpen, icons, depth }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const { currentPath, setCurrentPath, onFolderChange } = useFileNavigation()

  const handleFolderSwitch = () => {
    setIsActive(true)
    onFileOpen(folder)
    setCurrentPath(folder.path)
    onFolderChange?.(folder.path)
  }

  const handleCollapseChange = (e) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    setIsActive(currentPath === folder.path); //Setting isActive to a folder if its path matches currentPath

    // Auto expand parent folder if its child is accessed via file navigation
    // Explanation: Checks if the current folder's parent path matches with any folder path i.e. Folder's parent
    // then expand that parent.
    const currentPathArray = currentPath.split("/")
    currentPathArray.pop(); //splits with '/' and pops to remove last element to get current folder's parent path
    if (currentPath.startsWith(folder.path)) setIsOpen(true)
  }, [currentPath])

  if (folder.subDirectories.length > 0 && depth>1) {
    return (
      <>
        <div onClick={handleFolderSwitch} className={`sb-folders-list-item ${isActive ? "active-list-item" : ""}`}>
          <span onClick={handleCollapseChange}>
            <MdKeyboardArrowRight size={20} className={`folder-icon-default ${isOpen ? "folder-rotate-down" : ""}`} />
          </span>
          <div className="sb-folder-details">
            {isOpen ? (
                folder.class && icons && icons.get(folder.class) ?
                  icons.get(folder.class).open || icons.get(folder.class).default
                  :
                  <FaRegFolderOpen size={20} className="folder-open-icon" />
              )
              :
              (
                folder.class && icons && icons.get(folder.class)?
                  icons.get(folder.class).closed || icons.get(folder.class).default
                  :
                  <FaRegFolder size={17} className="folder-close-icon" />
              )
            }
            <span className="sb-folder-name" title={folder.name} style={{marginLeft:'2px'}}>
              {folder.name}
            </span>
          </div>
        </div>
        <Collapse open={isOpen}>
          <div className="folder-collapsible">
            {folder.subDirectories.map((item, index) => (
              <FolderTree key={index} folder={item} onFileOpen={onFileOpen} icons={icons} depth={depth-1}/>
            ))}
          </div>
        </Collapse>
      </>
    )
  } 
  else {
    return (
      <div onClick={handleFolderSwitch} className={`sb-folders-list-item ${isActive ? "active-list-item" : ""}`} >
        <span className="non-expanable"></span>
        <div className="sb-folder-details">
          {isActive ? (
              folder.class && icons && icons.get(folder.class)?
                icons.get(folder.class).open || icons.get(folder.class).default
                :
                <FaRegFolderOpen size={20} className="folder-open-icon" />
          )
          :
          (
              folder.class && icons && icons.get(folder.class)?
                icons.get(folder.class).closed || icons.get(folder.class).default
                :
                <FaRegFolder size={17} className="folder-close-icon" />
          )}
          <span className="sb-folder-name" title={folder.name} style={{marginLeft:'2px'}}>
            {folder.name}
          </span>
        </div>
      </div>
    )
  }
};

export default FolderTree;
