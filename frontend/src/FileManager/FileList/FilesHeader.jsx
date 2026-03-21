import React, { useMemo, useState, useRef } from 'react'
import Checkbox from '../../components/Checkbox/Checkbox'
import { useFileNavigation } from '../../contexts/FileNavigationContext'
import { useSelection } from '../../contexts/SelectionContext'
import { useTranslation } from '../../contexts/TranslationProvider'
import { useOptions } from '../../contexts/OptionsContext'
import { FaEllipsisV } from 'react-icons/fa'
import { HeaderSelector} from '../../components/HeaderSelector/HeaderSelector'
import { createPortal } from 'react-dom'

const FilesHeader = ({ 
    space, 
    spaces, 
    unselectFiles, 
    onSort, 
    sortConfig, 
    onHeaderChangeWidth, 
    onHeaderRemove, 
    onHeadersReset, 
    fontFamily, 
    headersWidth 
}) => {
    const t = useTranslation()
    const [showSelectAll, setShowSelectAll] = useState(false)
    const { options } = useOptions()
    const { selectedFiles, setSelectedFiles } = useSelection()
    const { currentPathFiles } = useFileNavigation()

    const [draggingColumn, setDraggingColumn] = useState(undefined)
    const [headerSelectorVisible, setHeaderSelectorVisible] = useState(false)
    
    const startXRef = useRef(0)
    const startWidthRef = useRef(0)
    
    const containerRef = useRef(null)
    const anchorRef = useRef(null)

    const allFilesSelected = useMemo(() => {
        return (currentPathFiles.length > 0) && (selectedFiles.length === currentPathFiles.length)
    }, [selectedFiles, currentPathFiles])

    const colNameWidth = useMemo(() => {
        if (headersWidth && headersWidth['name']) return headersWidth['name']
        return `calc(${spaces.get(space)?.width || 10}% - 60px)`
    }, [headersWidth, space, spaces])

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(currentPathFiles)
            setShowSelectAll(true)
        } else {
            unselectFiles()
        }
    }

    const handleSort = (key, format) => {
        if (onSort) onSort(key, format)
    }

    const handleMouseDown = (e, name) => {
        setDraggingColumn(name)
        
        const el = document.getElementById('col-' + name)
        if (!el) return

        startXRef.current = e.clientX
        startWidthRef.current = el.offsetWidth
        e.preventDefault()
    }

    const handleMouseUp = () => {
        setDraggingColumn(undefined)
    }

    const handleMouseMove = (e) => {
        if (draggingColumn === undefined) return

        const deltaX = e.clientX - startXRef.current
        let newWidth = startWidthRef.current + deltaX
        if (newWidth < 40) newWidth = 40
        onHeaderChangeWidth(draggingColumn, newWidth)
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
            <section
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="files-container"
                >

                {/* Column: Name */}
                <div 
                    id='col-name' 
                    className={`column-header ${sortConfig?.key === 'name' ? 'active' : ''}`} 
                    style={{ width: colNameWidth, paddingLeft: options.checkBox ? '55px' : '33px'}} 
                    onClick={() => handleSort('name', 'string')}
                >
                    {spaces.get(space)?.text || ''}
                    {sortConfig?.key === 'name' && (
                        <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                </div>
                <div
                    className={`${spaces.get(space)?.configurable ? 'column-resize':'column-no-resize'} ${draggingColumn === 'name' ? "column-dragging" : ""}`}
                    onMouseDown={spaces.get(space)?.configurable ? (e) => handleMouseDown(e, property.name) : () => {}}
                />

                {/* Dynamic property columns */}
                { spaces.get(space)?.properties.filter(p => p.visible).map((property) => {
                    const currentW = headersWidth[property.name] || `${property.width}%`
                    
                    return (
                        <React.Fragment key={property.name}>
                            <div className='column-header-divider' style={{ width: currentW }}>
                                <div 
                                    id={'col-' + property.name} 
                                    className={`${sortConfig?.key === property.source ? 'active' : ''}`} 
                                    style={{ width: '100%'}} 
                                    onClick={() => { if (property.sortable) handleSort(property.source, property.format)}}
                                >
                                    {property.text}
                                    {property.sortable && sortConfig?.key === property.source && (
                                        <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                    )}
                                </div>
                                { property.removable && 
                                    <span 
                                        style={{ color: '#dddddd', cursor: 'pointer', transition: '0.3s', paddingRight: '4px' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = 'black')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#dddddd')}
                                        onClick={e => {
                                            e.stopPropagation() // Evita activar el Sort al borrar
                                            onHeaderRemove(space, property.name)
                                        }}
                                    >
                                        x
                                    </span>
                                }
                            </div>
                            {/*
                            <div
                                className={`${spaces.get(space)?.configurable ? 'column-resize':'column-no-resize'} ${draggingColumn === property.name ? "column-dragging" : ""}`}
                                onMouseDown={spaces.get(space)?.configurable ? (e) => handleMouseDown(e, property.name) : () => {}}
                            />*/}
                        </React.Fragment>
                    )
                })}

                {/* Coliumn selector */}
                { spaces.get(space)?.configurable ?
                    <span className='column-header' ref={anchorRef} style={{ width: '30px', textAlign: 'center' }}>
                        <FaEllipsisV style={{cursor:'pointer'}} onClick={() => setHeaderSelectorVisible(true)}/>
                    </span>
                    :
                    <></>
                }

                {headerSelectorVisible && createPortal(
                    <div style={{
                        position: 'fixed',
                        top: anchorRef.current?.getBoundingClientRect().top,
                        left: (anchorRef.current?.getBoundingClientRect().left || 0) - 200,
                        zIndex: 9999,
                        fontFamily,
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        <HeaderSelector
                            setHeaderSelectorVisible={setHeaderSelectorVisible}
                            onHeadersReset={onHeadersReset}
                            space={space}
                            spaces={spaces}
                        />
                    </div>,
                    document.body
                )}
            </section>
        </div>
    )    
}

export default FilesHeader
