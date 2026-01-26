import React, { useEffect, useRef, useState } from 'react'
import { FaFolder, FaRegFile, FaRegFolderOpen } from 'react-icons/fa6'
import { useFileIcons } from '../../hooks/useFileIcons'
import CreateFolderAction from '../Actions/CreateFolder/CreateFolder.action'
import RenameAction from '../Actions/Rename/Rename.action'
import { useFileNavigation } from '../../contexts/FileNavigationContext'
import { useSelection } from '../../contexts/SelectionContext'
import { useClipBoard } from '../../contexts/ClipboardContext'
import { useLayout } from '../../contexts/LayoutContext'
import { useOptions } from '../../contexts/OptionsContext'
import Checkbox from '../../components/Checkbox/Checkbox'
import { getObjectSize } from '../../utils/getObjectSize'
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'
import { DateTime } from 'luxon'
import { applyFilters } from '../../utils/filters'

const dragIconSize = 50

const FileItem = ({
    space,
    spaces,
    icons,
    index,
    file,
    searchText,
    searchRegex,
    searchCasing,
    categories,
    onCreateFolder,
    onRename,
    enableFilePreview,
    onFileOpen,
    filesViewRef,
    selectedFileIndexes,
    triggerAction,
    handleContextMenu,
    setLastSelectedFile,
    draggable,
    formatDate
    }) => {
    const [fileSelected, setFileSelected] = useState(false)
    const [lastClickTime, setLastClickTime] = useState(0)
    const [checkboxClassName, setCheckboxClassName] = useState('hidden')
    const [dropZoneClass, setDropZoneClass] = useState('')
    const [tooltipPosition, setTooltipPosition] = useState(null)

    const { activeLayout } = useLayout()
    const iconSize = activeLayout === 'grid' ? 48 : 20
    const fileIcons = useFileIcons(iconSize)
    const { setCurrentPath, currentPathFiles, onFolderChange, currentFolder } = useFileNavigation()
    const { setSelectedFiles } = useSelection()
    const { clipBoard, handleCutCopy, setClipBoard, handlePasting } = useClipBoard()
    const dragIconRef = useRef(null)
    const dragIcons = useFileIcons(dragIconSize)
    const { options } = useOptions()
    const contextMenuRef = useDetectOutsideClick(() => setVisible(false))
    const [visible, setVisible] = useState(false)
    
    //const [clickPosition, setClickPosition] = useState({ clickX: 0, clickY: 0 })

    // const {
    //     clickPosition,
    // } = useFileList(undefined, undefined, undefined, undefined, undefined, space, spaces)

    const isFileMoving =
        clipBoard?.isMoving &&
        clipBoard.files.find((f) => f.name === file.name && f.path === file.path)

    const handleFileAccess = () => {
        onFileOpen(file)
        if (file.isDirectory) {
            setCurrentPath(file.path)
            onFolderChange?.(file.path)
            setSelectedFiles([])
        } 
        else {
            enableFilePreview && triggerAction.show('previewFile')
        }
    }

    const handleFileRangeSelection = (shiftKey, ctrlKey) => {
        if (selectedFileIndexes.length > 0 && shiftKey) {
            let reverseSelection = false
            let startRange = selectedFileIndexes[0]
            let endRange = index

            console.log('selec')
            // Reverse Selection
            if (startRange >= endRange) {
                const temp = startRange
                startRange = endRange
                endRange = temp
                reverseSelection = true
            }

            const filesRange = currentPathFiles.slice(startRange, endRange + 1)
            let selected = reverseSelection ? filesRange.reverse() : filesRange
            selected = applyFilters(selected, searchText, searchRegex, searchCasing, categories, currentFolder.categories)
            setSelectedFiles(selected)
        }
        else if (selectedFileIndexes.length > 0 && ctrlKey) {
            // Remove file from selected files if it already exists on CTRL + Click, otherwise push it in selectedFiles

            setSelectedFiles((prev) => {
                const filteredFiles = prev.filter((f) => f.path !== file.path)
                if (prev.length === filteredFiles.length) return [...prev, file]
                return applyFilters(filteredFiles, searchText, searchRegex, searchCasing, categories, currentFolder.categories)
            })
        }
        else {
            setSelectedFiles([file])
        }
    }

    const handleFileSelection = (e) => {
        e.stopPropagation()
        if (file.isEditing) return

        handleFileRangeSelection(e.shiftKey, e.ctrlKey)

        const currentTime = new Date().getTime()
        if (currentTime - lastClickTime < 300) {
           handleFileAccess()
            return
        }
        setLastClickTime(currentTime)
    }

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation()
            setSelectedFiles([file])
            handleFileAccess()
        }
    }

    const handleItemContextMenu = (e) => {
        e.stopPropagation()
        e.preventDefault()

        if (file.isEditing) return

        if (!fileSelected) setSelectedFiles([file])

        setLastSelectedFile(file)
        handleContextMenu(e, true)
    }

    // Selection Checkbox Functions
    const handleMouseOver = () => {
        setCheckboxClassName('visible')
    }

    const handleMouseLeave = () => {
        !fileSelected && setCheckboxClassName('hidden')
    }

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            setSelectedFiles((prev) => [...prev, file])
        }
        else {
            setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name && f.path !== file.path))
        }
        setFileSelected(e.target.checked)
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setDragImage(dragIconRef.current, 30, 50)
        e.dataTransfer.effectAllowed = 'copy'
        handleCutCopy(true)
    }

    const handleDragEnd = () => setClipBoard(null)

    const handleDragEnterOver = (e) => {
        e.preventDefault()
        if (fileSelected || !file.isDirectory) {
            e.dataTransfer.dropEffect = 'none'
        } 
        else {
            setTooltipPosition({ x: e.clientX, y: e.clientY + 12 })
            e.dataTransfer.dropEffect = 'copy'
            setDropZoneClass('file-drop-zone')
        }
    }

    const handleDragLeave = (e) => {
        // To stay in dragging state for the child elements of the target drop-zone
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDropZoneClass((prev) => (prev ? '' : prev))
            setTooltipPosition(null)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        if (fileSelected || !file.isDirectory) return

        handlePasting(file)
        setDropZoneClass((prev) => (prev ? '' : prev))
        setTooltipPosition(null)
    }

    useEffect(() => {
        setFileSelected(selectedFileIndexes.includes(index))
        setCheckboxClassName(selectedFileIndexes.includes(index) ? 'visible' : 'hidden')
    }, [selectedFileIndexes])


    function formatAgeCompact(duracion) {
        let partes = []

        // Días
        const days = Math.floor(duracion.days)
        if (days > 0) {
            partes.push(`${days}d`)
            duracion = duracion.minus({ days }) // Restar los días enteros para calcular las horas
        }

        // Horas
        const hours = Math.floor(duracion.hours)
        if (hours > 0 || partes.length > 0) { // Incluir horas si hay días o si es la unidad principal
            partes.push(`${hours}h`)
            duracion = duracion.minus({ hours }) // Restar las horas enteras
        }

        // Minutos
        const minutes = Math.floor(duracion.minutes)
        if (minutes > 0 && partes.length < 2) { // Incluir minutos solo si no se han incluido ya 2 unidades (para formato compacto)
            partes.push(`${minutes}m`)
        }

        // Devolver la cadena (unir las dos primeras partes para mantener la compacidad)
        return partes.slice(0, 2).join('')
    }    

    return (
        <div
            className={`file-item-container ${dropZoneClass} ${
                fileSelected || !!file.isEditing ? 'file-selected' : ''
            } ${isFileMoving ? 'file-moving' : ''}`}
            tabIndex={0}
            title={file.name}
            onClick={handleFileSelection}
            onKeyDown={handleOnKeyDown}
            onContextMenu={handleItemContextMenu}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            draggable={fileSelected && draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnterOver}
            onDragOver={handleDragEnterOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className='file-item' style={{ paddingRight:0, paddingLeft: options.checkBox? '33px':'12px', width:activeLayout==='list'?`calc(${spaces.get(space).width}% - 34px)`:''}}>
                { !file.isEditing && options.checkBox && (
                    <Checkbox
                        name={file.name}
                        id={file.name}
                        checked={fileSelected}
                        className={`selection-checkbox ${checkboxClassName}`}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                    />)
                }

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,      // force fixed size icon
                    width: iconSize,    
                    minWidth: iconSize
                }}>
                    { file.isDirectory ? (
                        file.class && icons && icons.get(file.class)?
                            (activeLayout === 'grid'? icons.get(file.class).grid : icons.get(file.class).list) || <FaFolder size={iconSize}/>
                            :
                            <FaRegFolderOpen size={iconSize} />
                        )
                        : 
                        (
                            file.class && icons && icons.get(file.class)?
                                React.cloneElement(icons.get(file.class).open || icons.get(file.class).default, {height:40})
                                :          
                                <> {fileIcons[file.name?.split('.').pop()?.toLowerCase()] ?? <FaRegFile size={iconSize} />} </>
                        )
                    }
                </div>

                { file.isEditing ? (
                        <div className={`rename-file-container ${activeLayout}`}>
                            { triggerAction.actionType === 'createFolder' ? 
                                <CreateFolderAction filesViewRef={filesViewRef} file={file} onCreateFolder={onCreateFolder} triggerAction={triggerAction} />
                            :
                                <RenameAction filesViewRef={filesViewRef} file={file} onRename={onRename} triggerAction={triggerAction} />
                            }
                        </div>
                    )
                    :
                    (
                        activeLayout==='grid' ?
                            <span className='text-truncate file-name'>{file.name}</span>
                        :
                            <span className='text-truncate file-name' style={{widh:(spaces.get(space).width*2)+'%'}}>{file.name}</span>
                    )
                }
            </div>

            {activeLayout === 'list' && spaces.get(space).properties.filter(p => p.visible).filter(d => d.name!=='name').map((property) => {
                let content = 'n/d'

                if (file.data) {
                    content = file.data[property.source]
                    switch (property.format) {
                        case 'size':
                            content = getObjectSize(spaces.get(space), file.data[property.source])
                            break
                        case 'date':
                            content = formatDate(file.data[property.source])
                            break
                        case 'age':
                            let ts = DateTime.fromISO(file.data[property.source])
                            const duracion = DateTime.now().diff(ts, ['days', 'hours', 'minutes'])
                            content = formatAgeCompact(duracion)
                            break
                        case 'function':
                            content='n/a'
                            if (property.source && typeof property.source === 'function') content = property.source(file.path)
                            break
                    }
                }
                return (
                    <div key={property.name} className='text-truncate' style={{display:'flex', width: property.width+'%', fontSize:'0.8em', alignItems:'center', textAlign:'left'}}>{content}</div>
                )
            })}

            {/* Drag Icon & Tooltip Setup */}
            {tooltipPosition && (
                <div style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px`}} className='drag-move-tooltip'>
                    Move to <span className='drop-zone-file-name'>{file.name}</span>
                </div>
            )}

            <div ref={dragIconRef} className='drag-icon'>
                {file.isDirectory ? (
                    <FaRegFolderOpen size={dragIconSize} />
                ) : (
                <>
                    {dragIcons[file.name?.split('.').pop()?.toLowerCase()] ?? (
                    <FaRegFile size={dragIconSize} />
                    )}
                </>
                )}
            </div>

        {/* Drag Icon & Tooltip Setup */}
        </div>
    )
}

export default FileItem
