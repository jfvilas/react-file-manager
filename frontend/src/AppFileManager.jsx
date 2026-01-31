import { useEffect, useRef, useState } from "react";
import { createFolderAPI } from "./api/createFolderAPI";
import { deleteAPI } from "./api/deleteAPI";
import { downloadFile } from "./api/downloadFileAPI";
import { copyItemAPI, moveItemAPI } from "./api/fileTransferAPI";
import { getAllFilesAPI } from "./api/getAllFilesAPI";
import { renameAPI } from "./api/renameAPI";
import "./AppFileManager.scss";
import FileManager from "./FileManager/FileManager";
import { FaTrash, FaBox, FaDocker, FaInfo, FaLinux, FaPowerOff } from "react-icons/fa6";
import { BiAlarmExclamation, BiAngry, BiRadar } from "react-icons/bi";

function App() {
    const fileUploadConfig = {
        url: import.meta.env.VITE_API_BASE_URL + "/upload",
    }

    const fileDownloadConfig = {
        //url: "https://getsamplefiles.com",
        //url: 'https://raw.githubusercontent.com/jfvilas/plugin-kwirth-log/refs/heads/master',
        //url: 'https://raw.githubusercontent.com/aa/tensorflow/refs/heads/master',
        url:'https://raw.githubusercontent.com/jfvilas/plugin-kwirth-log/refs/heads/master',
        headers : {
        //Authorization: 'Bearer xxx',
        //'X-Julio': 'Fernandez'
        }

    }

    const [isLoading, setIsLoading] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const isMountRef = useRef(false);

    const showContainers = (f) => {
        console.log(f)
        return <span style={{width:'10px', backgroundColor:'orange', height:'10px', marginRight:'2px'}}/>
    }

    const [files, setFiles] = useState([
        {
            name: "default",
            isDirectory: true,
            path: "/default",
            data: {
                updatedAt: "2024-09-09T10:30:00Z",
            },
            class: 'namespace'

        },
        {
            name: "package.json",
            isDirectory: false,
            path: "/package.json", // Located in Root directory as well
            data: {
                updatedAt: "2024-09-09T11:00:00Z",
            },
            class: 'namespace'
        },
        {
            name: "kube-system",
            isDirectory: true,
            path: "/kube-system", // Located in Root directory as well
            dat: {
                updatedAt: "2024-09-09T11:00:00Z",
            },
            class: 'namespace'
        },
        {
            name: "coredns",
            isDirectory: true,
            path: "/kube-system/coredns", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            },
            class: 'pod'
        },
        {
            name: "loki",
            isDirectory: true,
            path: "/default/loki", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            },
            class: 'pod'
        },
        {
            name: "grafana",
            isDirectory: true,
            path: "/default/grafana", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            },
            class: 'pod'
        },
        {
            name: "stc",
            isDirectory: true,
            path: "/default/loki/stc", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            },
            class: 'container'
        },
        {
            name: "logger",
            isDirectory: true,
            path: "/default/loki/logger", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            },
            class: 'container'
        },
        {
            name: "bin",
            isDirectory: true,
            path: "/default/loki/logger/bin", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "etc",
            isDirectory: true,
            path: "/default/loki/logger/etc", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "download",
            isDirectory: true,
            path: "/download", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "mp3",
            isDirectory: true,
            path: "/download/mp3", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "mp4",
            isDirectory: true,
            path: "/download/mp4", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "txt",
            isDirectory: true,
            path: "/download/txt", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "md",
            isDirectory: true,
            path: "/download/md", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "pdf",
            isDirectory: true,
            path: "/download/pdf", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "fich1",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich1", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 9000, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich2",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich2", // Located inside the "Pictures" folder
            data: {
                size: 240000, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich3",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich3", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                status: <BiRadar/>,
                size: 222248, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich4",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich4", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                status: <BiAngry color="green"/>,
                size: 20348, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich5",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich5", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                status: <BiAlarmExclamation/>,
            }
        },
        {
            name: "fich6.png",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich6.png", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                format: showContainers,
                size: 21452345,
            }
        },
        {
            name: "sample-2.pdf",
            isDirectory: false,
            path: "/download/pdf/sample-2.pdf", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 48321, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "sample-1.mp3",
            isDirectory: false,
            path: "/download/mp3/sample-1.mp3", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 48, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "sample-2.mp4",
            isDirectory: false,
            path: "/download/mp4/sample-2.mp4", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 14483, // File size in bytes (example: 2 KB)
            }
        },        
        {
            name: "sample-5.txt",
            isDirectory: false,
            path: "/download/txt/sample-5.txt", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 201, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "sample-4.md",
            isDirectory: false,
            path: "/download/md/sample-4.md", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 8, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich8",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich8", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 128, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "fich9",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich9", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
        {
            name: "fich10",
            isDirectory: false,
            path: "/default/loki/logger/bin/fich10", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
                size: 12048, // File size in bytes (example: 2 KB)
            }
        },
        {
            name: "dir1",
            isDirectory: true,
            path: "/default/loki/logger/bin/dir1", // Located inside the "Pictures" folder
            data: {
                updatedAt: "2024-09-08T16:45:00Z",
            }
        },
    ])


    // Get Files
    const getFiles = async () => {
        setIsLoading(true);
        const response = await getAllFilesAPI();
        if (response.status === 200 && response.data) {
        setFiles(response.data);
        } else {
        console.error(response);
        setFiles([]);
        }
        setIsLoading(false);
    };

    // useEffect(() => {
    //   if (isMountRef.current) return;
    //   isMountRef.current = true;
    //   getFiles();
    // }, []);
    //

    // Create Folder
    const handleCreateFolder = async (name, parentFolder) => {
        setIsLoading(true);
        const response = await createFolderAPI(name, parentFolder?._id);
        if (response.status === 200 || response.status === 201) {
        setFiles((prev) => [...prev, response.data]);
        } else {
        console.error(response);
        }
        setIsLoading(false);
    };
    //

    // File Upload Handlers
    const handleFileUploading = (file, parentFolder) => {
        return { parentId: parentFolder?._id };
    };

    const handleFileUploaded = (response) => {
        const uploadedFile = JSON.parse(response);
        setFiles((prev) => [...prev, uploadedFile]);
    };
    //

    // Rename File/Folder
    const handleRename = async (file, newName) => {
        setIsLoading(true);
        const response = await renameAPI(file._id, newName);
        if (response.status === 200) {
        getFiles();
        } else {
        console.error(response);
        }
        setIsLoading(false);
    };
    //

    // Delete File/Folder
    const handleDelete = async (files) => {
        setIsLoading(true);
        const idsToDelete = files.map((file) => file._id);
        const response = await deleteAPI(idsToDelete);
        if (response.status === 200) {
        getFiles();
        } else {
        console.error(response);
        setIsLoading(false);
        }
    };
    //

    // Paste File/Folder
    const handlePaste = async (copiedItems, destinationFolder, operationType) => {
        setIsLoading(true);
        const copiedItemIds = copiedItems.map((item) => item._id);
        if (operationType === "copy") {
        const response = await copyItemAPI(copiedItemIds, destinationFolder?._id);
        } else {
        const response = await moveItemAPI(copiedItemIds, destinationFolder?._id);
        }
        await getFiles();
    }

    const handleLayoutChange = (layout) => {
    }

    // Refresh Files
    const handleRefresh = () => {
        getFiles();
    }

    const handleFileOpen = (file) => {
        console.log(`Opening file: ${file.name}`)
    }

    const handleError = (error, file) => {
        console.error(error)
    }

    const handleDownload = async (files) => {
        await downloadFile(files)
    }

    const handleCut = (files) => {
        console.log("Moving Files", files)
    }

    const handleCopy = (files) => {
        console.log("Copied Files", files)
    }

    const handleSelectionChange = (files) => {
        console.log("Selected Files", files)
    }

    let icons = new Map()
    // class, icon closed, icon open
    icons.set('namespace', { open: <FaLinux/>, closed: <FaLinux/>, default: <FaLinux/>, grid: <FaLinux size={50} />, list: <FaLinux size={20} /> } )
    icons.set('pod', { default: <FaBox style={{size:18, marginRight:'2px'}}/>, grid: <FaBox size={50}/> } )
    icons.set('container', { default: <FaDocker style={{size:18, marginRight:'2px'}}/>, grid:<FaDocker size={50}/> })

    const actions = new Map()
    actions.set('namespace', [
        {
            title: 'View namespace',
            icon: <FaInfo />,
            onClick: (files) => {
                console.log('onclick view')
                console.log(files)
            }
        },
        {
            title: 'Delete namespace',
            icon: <FaTrash />,
            onClick: (files) => {
                console.log('onclick delete')
                console.log(files)
            }
        }
    ])

    actions.set('pod', [
        {
            title: 'restart',
            icon: <FaPowerOff/>,
            onClick: (files) => {
                console.log('onclick pods')
                console.log(files)
            }
        },
        {
            title: 'Pod info',
            icon: <FaInfo/>,
        }  
    ])
    actions.set('container', [
        {
            title: 'shell',
            icon: <FaLinux/>,
            onClick: (files) => {
            console.log('onclick cont')
                console.log(files)
            }
        }
    ])
    
    return (
        <div className="app">
            <div className="file-manager-container">
                <FileManager
                actions={actions}
                files={files}
                fileUploadConfig={fileUploadConfig}
                fileDownloadConfig={fileDownloadConfig}
                icons={icons}
                isLoading={isLoading}
                onCreateFolder={handleCreateFolder}
                onFileUploading={handleFileUploading}
                onFileUploaded={handleFileUploaded}
                onCut={handleCut}
                onCopy={handleCopy}
                onPaste={handlePaste}
                onRename={handleRename}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onLayoutChange={handleLayoutChange}
                onRefresh={handleRefresh}
                onFileOpen={handleFileOpen}
                onSelectionChange={handleSelectionChange}
                onError={handleError}
                layout="grid"
                enableFilePreview={true}
                maxFileSize={10485760}
                filePreviewPath={'https://getsamplefiles.com'}
                acceptedFileTypes={["txt", "png", "jpg", "jpeg", "pdf", "doc", "docx", "exe"]}
                height="100%"
                width="100%"
                initialPath={'/default/loki/logger/bin'}
                onFolderChange={setCurrentPath}
                showBreadcrumb={true}
                maxNavigationPaneDepth={3}
                />
            </div>
        </div>
    )
}

export default App
