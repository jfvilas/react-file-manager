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

const Toolbar = ({ onLayoutChange, onRefresh, triggerAction, permissions, onNavigationPaneChange, spaces }) => {
    const [showViewOptions, setShowViewOptions] = useState(false)
    const { currentFolder, currentPathFiles } = useFileNavigation()
    const { selectedFiles, setSelectedFiles, handleDownload } = useSelection()
    const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard()
    const t = useTranslation()
    const fileDataLeftItems = [
        {
            icon: <BsFolderPlus size={17} strokeWidth={0.3} />,
            text: t("newFolder"),
            permission: permissions.create,
            onClick: () => triggerAction.show("createFolder"),
        },
        {
            icon: <MdOutlineFileUpload size={18} />,
            text: t("upload"),
            permission: permissions.upload,
            onClick: () => triggerAction.show("uploadFile"),
        },
        {
            icon: <FaRegPaste size={18} />,
            text: t("paste"),
            permission: !!clipBoard,
            onClick: handleFilePasting,
        }
    ]
    let space = currentFolder?.class || 'filedata'

    let leftItems = fileDataLeftItems
    if (space!=='filedata' && spaces && spaces.has(space)) {
        leftItems = spaces.get(space).leftItems || []    //+++ test "[]" (no leftItems specified)
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
        {
            icon: <FiRefreshCw size={16} />,
            title: t("refresh"),
            onClick: () => {
                validateApiCallback(onRefresh, "onRefresh");
                setClipBoard(null);
            },
        }
    ]

    function handleFilePasting() {
        handlePasting(currentFolder);
    }

    const handleDownloadItems = () => {
        handleDownload()
        setSelectedFiles([])
    }

    const onToolbarClick = (option) => {
        if (option.onClick) option.onClick(selectedFiles)
    }

    const renderLeftItems = () => {
        if (space!=='filedata') {
            // we take the class for the folder or from the first file
            let items= []
            if (leftItems) {
                leftItems.map((item, index) => 
                    items.push (
                        <button key={index} className="item-action file-action" onClick={() => onToolbarClick(item)}>
                            {item.icon}
                            <span>{item.text}</span>
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

    const renderRightItems = () => {
        return <>
            {toolbarRightItems.map((item, index) => (
                <div key={index} className="toolbar-left-items">
                    <button className="item-action icon-only file-action" title={item.title} onClick={item.onClick}>
                        {item.icon}
                    </button>
                    {index !== toolbarRightItems.length - 1 && <div className="item-separator"></div>}
                </div>
            ))}

            {showViewOptions && (
                <ViewOptions
                    setShowViewOptionsMenu={setShowViewOptions}
                    onLayoutChange={onLayoutChange}
                    onNavigationPaneChange={onNavigationPaneChange}
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
                    { leftItems && leftItems.filter((item) => item.permission).map((item, index) => (
                        <button className="item-action file-action" key={index} onClick={item.onClick}>
                            {item.icon}
                            <span>{item.text}</span>
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
