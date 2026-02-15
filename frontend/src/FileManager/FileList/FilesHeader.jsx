import React, { useMemo, useState, useRef, useEffect } from 'react'
import Checkbox from '../../components/Checkbox/Checkbox'
import { useFileNavigation } from '../../contexts/FileNavigationContext'
import { useSelection } from '../../contexts/SelectionContext'
import { useTranslation } from '../../contexts/TranslationProvider'
import { useOptions } from '../../contexts/OptionsContext'

const FilesHeader = ({ space, spaces, unselectFiles, onSort, sortConfig, onChangeWidth }) => {
    const t = useTranslation()
    const [showSelectAll, setShowSelectAll] = useState(false);
    const { options } = useOptions()
    const { selectedFiles, setSelectedFiles } = useSelection();
    const { currentPathFiles } = useFileNavigation();
    const [ draggingColumn, setDraggingColumn ] = useState(undefined)
    const [ colNameWidth, setColNameWidth ]  = useState(`calc(${spaces.get(space)?.width||10}% - 60px)`)
    const [ colNameInitialWidth, setColNameInitialWidth ]  = useState(0)
    
    const [ colWidth, setColWidth ]  = useState({})
    const [ colInitialWidth, setColInitialWidth ]  = useState({})
    
    const [ mousePos, setMousePos ]  = useState(0)
    const containerRef = useRef(null)

    const allFilesSelected = useMemo(() => {
        return (currentPathFiles.length > 0) && (selectedFiles.length === currentPathFiles.length)
    }, [selectedFiles, currentPathFiles])

    useEffect( () => {
        let allWidths = {}
        spaces.get(space)?.properties.filter(p => p.visible).map(p =>{
            allWidths[p.name] = `calc(${p.width}%)`
        })
        setColInitialWidth(allWidths)
    }, [])

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(currentPathFiles)
            setShowSelectAll(true)
        }
        else {
            unselectFiles()
        }
    }

    const handleSort = (key) => {
        if (onSort) onSort(key)
    }

    const handleMouseDown = (e, name) => {
        setDraggingColumn(name)
        let el = document.getElementById('col-'+name)
        if (name==='name') {
            setColNameInitialWidth(el.offsetWidth)
        }
        else {
            colInitialWidth[name]=el.offsetWidth
            setColInitialWidth({...colInitialWidth})
        }
        setMousePos(e.clientX)
    }
    const handleMouseUp = () => {
        setDraggingColumn(undefined)
    }

    const handleMouseMove = (e) => {
        if (draggingColumn===undefined) return
        e.preventDefault()

        let padding = options.checkBox? 15:35
        if (draggingColumn==='name') {
            let neww=colNameInitialWidth+e.clientX-mousePos-padding
            setColNameWidth(neww)
            onChangeWidth(draggingColumn, neww)
        }
        else {
            let neww=colInitialWidth[draggingColumn]+e.clientX-mousePos
            if (neww>0) {
                colWidth[draggingColumn] = neww
                setColWidth({...colWidth})
                onChangeWidth(draggingColumn, neww)
            }
        }
    }

    return (
        <div className='files-header' onMouseOver={() => setShowSelectAll(true)} onMouseLeave={() => setShowSelectAll(false)} >
            {
                options.checkBox && <div className='file-select-all'>
                    {(showSelectAll || allFilesSelected) && (
                    <Checkbox
                        id='selectAll'
                        checked={allFilesSelected}
                        onChange={handleSelectAll}
                        title='Select all'
                        disabled={currentPathFiles.length === 0}
                    />
                    )}
                </div>
            }
            {/* <div id='col-name' className={`${sortConfig?.key === 'name' ? 'active' : ''}`} style={{ width: `calc(${spaces.get(space)?.width||10}% - 60px)`, paddingLeft: options.checkBox? '15px':'35px'}} onClick={() => handleSort('name')}> */}
            <section
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="files-container"
                >

                {/* object name */}
                <div id='col-name' className={`${sortConfig?.key === 'name' ? 'active' : ''}`} style={{ width: colNameWidth, paddingLeft: options.checkBox? '15px':'35px'}} onClick={() => handleSort('name')}>
                    {spaces.get(space)?.text||''}
                    {sortConfig?.key === 'name' && (
                        <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                </div>
                <div
                    className={`column-resize ${draggingColumn ? "column-dragging" : ""}`}
                    onMouseDown={(e) => handleMouseDown(e,'name')}
                />

                {/* object props */}
                { spaces.get(space)?.properties.filter(p => p.visible).map((property) => {
                    return (<React.Fragment key={property.name}>
                            <div  id={'col-'+property.name} className={`${sortConfig?.key === property.source ? 'active' : ''}`} style={{ width: colWidth[property.name]||property.width+'%'}} onClick={() => { if (property.sortable) handleSort(property.source)}}>
                                {property.text}
                                {property.sortable && sortConfig?.key === property.source && (
                                    <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </div>
                            <div
                                className={`column-resize ${draggingColumn ? "column-dragging" : ""}`}
                                onMouseDown={(e) => handleMouseDown(e, property.name)}
                            />
                        </React.Fragment>
                    )
                })}
            </section>
        </div>
    )    
}

export default FilesHeader