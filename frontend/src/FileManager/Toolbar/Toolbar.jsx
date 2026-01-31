import { useState } from "react"
import { BsCopy, BsFolderPlus, BsScissors } from "react-icons/bs"
import { FiRefreshCw } from "react-icons/fi"
import { MdOutlineDelete, MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md"
import { BiRename } from "react-icons/bi"
import { FaRegPaste, FaListCheck } from "react-icons/fa6"
import { useFileNavigation } from "../../contexts/FileNavigationContext"
import { useSelection } from "../../contexts/SelectionContext"
import { useClipBoard } from "../../contexts/ClipboardContext"
import { validateApiCallback } from "../../utils/validateApiCallback"
import { useTranslation } from "../../contexts/TranslationProvider"
import { ViewOptions } from "./ViewOptions"
import "./Toolbar.scss"

const Toolbar = ({ onLayoutChange, onRefresh, triggerAction, permissions, onNavigationPaneChange, spaces, showRefresh, minFileActionsLevel }) => {
    const [ showViewOptions, setShowViewOptions ] = useState(false)
    const { currentFolder, currentPathFiles, currentOwnLayoutPath } = useFileNavigation()
    const { selectedFiles, setSelectedFiles, handleDownload } = useSelection()
    const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard()
    const t = useTranslation()
    let currentLevel = currentFolder? currentFolder.path.split('/').length-1 : 0

    let fileDataLeftItems = []
    if (currentLevel>=minFileActionsLevel) {
        let validLeftItems = []
        validLeftItems.push({
                icon: <BsFolderPlus size={17} strokeWidth={0.3} />,
                text: t("newFolder"),
                permission: permissions.create,
                onClick: () => triggerAction.show("createFolder"),
        })
        validLeftItems.push({
            icon: <MdOutlineFileUpload size={18} />,
            text: t("upload"),
            permission: permissions.upload,
            onClick: () => triggerAction.show("uploadFile"),
        })
        if (clipBoard?.files?.length>0) {
            validLeftItems.push({
                icon: <FaRegPaste size={18} />,
                text: t("paste"),
                permission: !!clipBoard,
                onClick: handleFilePasting,
            })
        }
        fileDataLeftItems = validLeftItems
    }

    let space = currentFolder?.class || 'filedata'

    let leftItems = fileDataLeftItems
    if (space!=='filedata' && spaces && spaces.has(space)) {
        leftItems = spaces.get(space).leftItems || []
        if (leftItems) {
            if (currentPathFiles.length>0 && spaces.get(currentPathFiles[0].class)?.leftItems) {
                if (selectedFiles.length>1) {
                    leftItems = [...leftItems, ...spaces.get(currentPathFiles[0].class).leftItems.filter(i => i.multi)]
                }
                else {
                    if (selectedFiles.length===1) leftItems = [...leftItems, ...spaces.get(currentPathFiles[0].class).leftItems]
                }
            }
            leftItems = leftItems.filter(i => i.text!=='~')
        }
    }

    // Toolbar Items

    const toolbarRightItems = [
        {
            icon: <FaListCheck size={16} />,
            title: t("changeView"),
            onClick: () => setShowViewOptions((prev) => !prev),
        },
        ...(showRefresh ?
            [{
                icon: <FiRefreshCw size={16} />,
                title: t("refresh"),
                onClick: () => {
                    validateApiCallback(onRefresh, "onRefresh");
                    setClipBoard(null);
                }
            }]
            :
            []
        )
    ]

    function handleFilePasting() {
        handlePasting(currentFolder);
    }

    const handleDownloadItems = () => {
        handleDownload()
        setSelectedFiles([])
    }

    const onToolbarFileActionClick = (toolBarAction, target) => {
        toolBarAction.onClick(selectedFiles.map (f => f.path), target)
    }

    const onToolbarOwnLayoutActionClick = (toolBarAction, target) => {
        toolBarAction.onClick([currentOwnLayoutPath], target)
    }

    const renderLeftItems = () => {
        if (space!=='filedata') {
            // we take the class for the folder or from the first file
            let items = []
            if (leftItems) {
                leftItems.map((leftItem, index) => 
                    items.push (
                        <button key={index} className="item-action file-action" onClick={(event) => onToolbarFileActionClick(leftItem, event.currentTarget)}>
                            {leftItem.icon}
                            <span>{leftItem.text}</span>
                        </button>
                    )
                )
            }
            return <>{items}</>
        }
        else {
            return <>
                {permissions.move && (
                <button className="item-action file-action" onClick={() => handleCutCopy(true)}>
                    <BsScissors size={18} />
                    <span>{t("cut")}</span>
                </button>
                )}
                {permissions.copy && (
                <button className="item-action file-action" onClick={() => handleCutCopy(false)}>
                    <BsCopy strokeWidth={0.1} size={17} />
                    <span>{t("copy")}</span>
                </button>
                )}
                {clipBoard?.files?.length > 0 && (
                <button
                    className="item-action file-action"
                    onClick={handleFilePasting}
                    // disabled={!clipBoard}
                >
                    <FaRegPaste size={18} />
                    <span>{t("paste")}</span>
                </button>
                )}
                {selectedFiles.length === 1 && permissions.rename && (
                <button
                    className="item-action file-action"
                    onClick={() => triggerAction.show("rename")}
                >
                    <BiRename size={19} />
                    <span>{t("rename")}</span>
                </button>
                )}
                {permissions.download && (
                <button className="item-action file-action" onClick={handleDownloadItems}>
                    <MdOutlineFileDownload size={19} />
                    <span>{t("download")}</span>
                </button>
                )}
                {permissions.delete && (
                <button
                    className="item-action file-action"
                    onClick={() => triggerAction.show("delete")}
                >
                    <MdOutlineDelete size={19} />
                    <span>{t("delete")}</span>
                </button>
                )}
            </>
        }
    }

    const onSelectChange = (change) => {
        switch (change) {
            case 'all':
                setSelectedFiles(currentPathFiles)
                break
            case 'none':
                setSelectedFiles([])
                break
            case 'invert':
                let result=[]
                for(let f of currentPathFiles)
                    if (!selectedFiles.includes(f)) result.push(f)
                setSelectedFiles(result)
                break
        }
    }

    const renderRightItems = () => {
        return <>
            {toolbarRightItems.map((rightItem, index) => (
                <div key={index} className="toolbar-left-items">
                    <button className="item-action icon-only file-action" style={{height:'32px'}} title={rightItem.title} onClick={rightItem.onClick}>
                        {rightItem.icon}
                    </button>
                    {index !== toolbarRightItems.length - 1 && <div className="item-separator"></div>}
                </div>
            ))}

            {showViewOptions && (
                <ViewOptions
                    setShowViewOptionsMenu={setShowViewOptions}
                    onLayoutChange={onLayoutChange}
                    onNavigationPaneChange={onNavigationPaneChange}
                    onSelectChange={onSelectChange}
                />
            )}
        </>
    }

    // Selected File/Folder Actions
    if (selectedFiles.length > 0) {
        return (<>
            <div className="toolbar file-selected">
                <div className="file-action-container fm-toolbar">
                    <div>
                        {renderLeftItems()}
                    </div>
                    <div>
                        {renderRightItems()}
                    </div>
                </div>
            </div>
        </>
        )
    }

    return (
        <div className="toolbar file-selected">
            <div className="file-action-container fm-toolbar">
                <div>
                    { leftItems && leftItems.filter((leftItemPerm) => leftItemPerm.permission).map((leftItem, index) => (
                        <button className="item-action file-action" key={index} onClick={(event) => onToolbarOwnLayoutActionClick(leftItem, event.currentTarget)}>
                            {leftItem.icon}
                            <span>{leftItem.text}</span>
                        </button>
                    ))}
                </div>
                <div>
                    {renderRightItems()}
                </div>
            </div>
        </div>
    )
}

Toolbar.displayName = "Toolbar"

export default Toolbar
