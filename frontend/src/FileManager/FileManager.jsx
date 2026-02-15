import { useMemo, useState, forwardRef, useImperativeHandle } from 'react'
import Loader from '../components/Loader/Loader'
import Toolbar from './Toolbar/Toolbar'
import NavigationPane from './NavigationPane/NavigationPane'
import BreadCrumb from './BreadCrumb/BreadCrumb'
import FileList from './FileList/FileList'
import Actions from './Actions/Actions'
import { OptionsProvider } from '../contexts/OptionsContext'
import { FilesProvider } from '../contexts/FilesContext'
import { FileNavigationProvider, useFileNavigation } from '../contexts/FileNavigationContext'
import { SelectionProvider } from '../contexts/SelectionContext'
import { ClipBoardProvider } from '../contexts/ClipboardContext'
import { LayoutProvider } from '../contexts/LayoutContext'
import { useTriggerAction } from '../hooks/useTriggerAction'
import { useColumnResize } from '../hooks/useColumnResize'
import PropTypes from 'prop-types'
import { dateStringValidator, urlValidator } from '../validators/propValidators'
import { TranslationProvider } from '../contexts/TranslationProvider'

import { defaultPermissions } from '../constants'
import { formatDate as defaultFormatDate } from '../utils/formatDate'
import './FileManager.scss'

const RefHandler = forwardRef((props, ref) => {
	const { setCurrentPath } = useFileNavigation()
	
	useImperativeHandle(ref, () => ({
		changeFolder: (ruta) => {
			setCurrentPath(ruta)
			props.onFolderChange?.(ruta)
		}
	}))
	return null
})

/**
 * FileManagerBody: Containes UI y and hooks which Contexts depends on.
 */
const FileManagerBody = ({ props, innerRef }) => {
	const {
		actions,
		space: initialSpace,
		spaces: initialSpaces,
		files,
		fileUploadConfig,
		fileDownloadConfig,
		icons,
		isLoading,
		onCreateFolder,
		onFileUploading = () => {},
		onFileUploaded = () => {},
		onFileUploadError = () => {},
		onCut,
		onCopy,
		onPaste,
		onRename,
		onDownload,
		onDelete = () => null,
		onLayoutChange = () => {},
		onRefresh,
		onFileOpen = () => {},
		onFolderChange = () => {},
		onSelect,
		onSelectionChange,
		onError = () => {},
		layout = 'grid',
		enableFilePreview = true,
		maxFileSize,
		filePreviewPath,
		acceptedFileTypes,
		height = '600px',
		width = '100%',
		initialPath = '',
		filePreviewComponent,
		primaryColor = '#6155b4',
		fontFamily = 'Nunito Sans, sans-serif',
		language = 'en-US',
		permissions: userPermissions = {},
		collapsibleNav = false,
		defaultNavExpanded = true,
		className = '',
		style = {},
		searchMode = 'auto',
		searchRegex = false,
		searchCasing = false,
		showRefresh = true,
		showContextMenu = true,
		categories = undefined,
		showBreadcrumb = false,
		maxNavigationPaneLevel = 2,
		minFileActionsLevel = 1,
		formatDate = defaultFormatDate
	} = props

	const [srchText, setSrchText] = useState('')
	const [srchRegex, setSrchRegex] = useState(false)
	const [srchCasing, setSrchCasing] = useState(false)
	const [isNavigationPaneOpen, onNavigationPaneChange] = useState(defaultNavExpanded)
	
	const triggerAction = useTriggerAction()
	const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } = useColumnResize(20, 80)
	
	const customStyles = {
		'--file-manager-font-family': fontFamily,
		'--file-manager-primary-color': primaryColor,
		height,
		width
	}
	
	const [columnWidths, setColumnWidths] = useState({})

	const onSearchFilterChange = (f, regex, casing) => {
		setSrchText(f)
		setSrchRegex(regex)
		setSrchCasing(casing)
	}
	
	const permissions = useMemo(
		() => ({ ...defaultPermissions, ...userPermissions }),
		[userPermissions]
	)

	let space = initialSpace || 'filedata'
	let spaces = initialSpaces || new Map()
	
	if (!spaces.has('filedata')) {
		spaces.set('filedata', {
			text: 'Name',
			source: 'name',
			width: 70,
			sumSourceProperty: 'size',
			sumReducer: 1024,
			sumUnits: ['bytes', 'KB', 'MB'],
			icons: new Map(),
			actions: new Map(),
			properties: [
				{
					name: 'updatedAt',
					text: 'Modified',
					source: 'updatedAt',
					format: 'date',
					width: 20,
					visible: true
				},
				{
					name: 'size',
					text: 'Size',
					source: 'size',
					format: 'size',
					width: 10,
					visible: true
				}
			]
		})
	}

	const onChangeWidth = (name, size) => {
		setColumnWidths(prev => ({ ...prev, [name]: size }))
	}

	return (
		<SelectionProvider
		onDownload={onDownload}
		onSelect={onSelect}
		onSelectionChange={onSelectionChange}
		>
		<ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
			<LayoutProvider layout={layout}>
			
			<RefHandler ref={innerRef} onFolderChange={onFolderChange} />

			<main
				className={`file-explorer ${className}`}
				onContextMenu={(e) => e.preventDefault()}
				style={{ ...customStyles, ...style }}
			>
				<Loader loading={isLoading} />
				
				<Toolbar
				onLayoutChange={onLayoutChange}
				onRefresh={onRefresh}
				triggerAction={triggerAction}
				permissions={permissions}
				onNavigationPaneChange={onNavigationPaneChange}
				spaces={spaces}
				searchMode={searchMode}
				searchText={srchText}
				searchRegex={srchRegex}
				searchCasing={srchCasing}
				categories={categories}
				showRefresh={showRefresh}
				showBreadcrumb={showBreadcrumb}
				minFileActionsLevel={minFileActionsLevel}
				/>

				<section
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				className='files-container'
				>
				<div
					className={`navigation-pane ${isNavigationPaneOpen ? 'open' : 'closed'}`}
					style={{ width: colSizes.col1 + '%' }}
				>
					<NavigationPane onFileOpen={onFileOpen} icons={icons} maxDepth={maxNavigationPaneLevel}/>
					<div
					className={`sidebar-resize ${isDragging ? 'sidebar-dragging' : ''}`}
					onMouseDown={handleMouseDown}
					/>
				</div>

				<div
					className='folders-preview'
					style={{ width: (isNavigationPaneOpen ? colSizes.col2 : 100) + '%' }}
				>
					<BreadCrumb
					collapsibleNav={collapsibleNav}
					isNavigationPaneOpen={isNavigationPaneOpen}
					onNavigationPaneChange={onNavigationPaneChange}
					tirggerAction={triggerAction}
					onSearchFilterChange={onSearchFilterChange}
					searchMode={searchMode}
					searchText={srchText}
					searchRegex={srchRegex}
					searchCasing={srchCasing}
					categories={categories}
					fontFamily={fontFamily}
					showBreadcrumb={showBreadcrumb}
					/>
					<FileList
					columnWidths={columnWidths}
					onChangeWidth={onChangeWidth}
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
					searchText={srchText}
					searchRegex={srchRegex}
					searchCasing={srchCasing}
					showContextMenu={showContextMenu}
					categories={categories}
					/>
				</div>
				</section>

				<Actions
				fileUploadConfig={fileUploadConfig}
				onFileUploading={onFileUploading}
				onFileUploadError={onFileUploadError}
				onFileUploaded={onFileUploaded}
				fileDownloadConfig={fileDownloadConfig}
				onDelete={onDelete}
				onRefresh={onRefresh}
				maxFileSize={maxFileSize}
				filePreviewPath={filePreviewPath}
				filePreviewComponent={filePreviewComponent}
				acceptedFileTypes={acceptedFileTypes}
				triggerAction={triggerAction}
				permissions={permissions}
				/>
			</main>
			</LayoutProvider>
		</ClipBoardProvider>
		</SelectionProvider>
	)
	}

	/**
	 * FileManager: Main FileManager componente.
	 * Encapsulates higher level providers
	 */
	const FileManager = forwardRef((props, ref) => {
	return (
		<OptionsProvider>
		<TranslationProvider language={props.language || 'en-US'}>
			<FilesProvider filesData={props.files} onError={props.onError}>
			<FileNavigationProvider 
				initialPath={props.initialPath || ''} 
				onFolderChange={props.onFolderChange}
			>
				<FileManagerBody props={props} innerRef={ref} />
			</FileNavigationProvider>
			</FilesProvider>
		</TranslationProvider>
		</OptionsProvider>
	)
})

FileManager.displayName = 'FileManager'

FileManager.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isDirectory: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      updatedAt: dateStringValidator,
      size: PropTypes.number,
      class: PropTypes.string
    })
  ).isRequired,
  fileUploadConfig: PropTypes.shape({
    url: urlValidator,
    headers: PropTypes.objectOf(PropTypes.string),
    method: PropTypes.oneOf(['POST', 'PUT']),
  }),
  isLoading: PropTypes.bool,
  onCreateFolder: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onDownload: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onFileOpen: PropTypes.func,
  onFolderChange: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onError: PropTypes.func,
  layout: PropTypes.oneOf(['grid', 'list']),
  maxFileSize: PropTypes.number,
  enableFilePreview: PropTypes.bool,
  filePreviewPath: urlValidator,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPath: PropTypes.string,
  filePreviewComponent: PropTypes.func,
  primaryColor: PropTypes.string,
  fontFamily: PropTypes.string,
  language: PropTypes.string,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    upload: PropTypes.bool,
    move: PropTypes.bool,
    copy: PropTypes.bool,
    rename: PropTypes.bool,
    download: PropTypes.bool,
    delete: PropTypes.bool,
  }),
  collapsibleNav: PropTypes.bool,
  defaultNavExpanded: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  formatDate: PropTypes.func,
}

export default FileManager