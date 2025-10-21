import { useEffect, useRef, useState } from "react";
import { createFolderAPI } from "./api/createFolderAPI";
import { deleteAPI } from "./api/deleteAPI";
import { downloadFile } from "./api/downloadFileAPI";
import { copyItemAPI, moveItemAPI } from "./api/fileTransferAPI";
import { getAllFilesAPI } from "./api/getAllFilesAPI";
import { renameAPI } from "./api/renameAPI";
import "./App.scss";
import FileManager from "./FileManager/FileManager";
import { FaBox, FaBoxOpen, FaDocker, FaLinux, FaRebel, FaRegFaceRollingEyes, FaRegSquare, FaSquare } from "react-icons/fa6";
import { FaJs, FaTshirt } from "react-icons/fa";

function App() {
  const fileUploadConfig = {
    url: import.meta.env.VITE_API_BASE_URL + "/upload",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const isMountRef = useRef(false);
  const [files, setFiles] = useState([
    {
      name: "default",
      isDirectory: true, // Folder
      path: "/default", // Located in Root directory
      updatedAt: "2024-09-09T10:30:00Z", // Last updated time
      class: 'namespace'
    },
    {
      name: "kube-system",
      isDirectory: true,
      path: "/kube-system", // Located in Root directory as well
      updatedAt: "2024-09-09T11:00:00Z",
      class: 'namespace'
    },
    {
      name: "coredns",
      isDirectory: true, // File
      path: "/kube-system/coredns", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      class: 'pod'
    },
    {
      name: "loki",
      isDirectory: true, // File
      path: "/default/loki", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      class: 'pod'
    },
    {
      name: "grafana",
      isDirectory: true, // File
      path: "/default/grafana", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      class: 'pod'
    },
    {
      name: "stc",
      isDirectory: true, // File
      path: "/default/loki/stc", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      class: 'container'
    },
    {
      name: "logger",
      isDirectory: true, // File
      path: "/default/loki/logger", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      class: 'container'
    },
    {
      name: "bin",
      isDirectory: true,
      path: "/default/loki/logger/bin", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
    },
    {
      name: "etc",
      isDirectory: true,
      path: "/default/loki/logger/etc", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
    },
    {
      name: "fich1",
      isDirectory: false,
      path: "/default/loki/logger/bin/fich1", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      size: 2048, // File size in bytes (example: 2 KB)
    },
    {
      name: "fich2",
      isDirectory: false,
      path: "/default/loki/logger/bin/fich2", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      size: 2048, // File size in bytes (example: 2 KB)
    },
    {
      name: "dir1",
      isDirectory: true,
      path: "/default/loki/logger/bin/dir1", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
    },
  ]);

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
  };
  //

  const handleLayoutChange = (layout) => {
    console.log(layout);
  };

  // Refresh Files
  const handleRefresh = () => {
    getFiles();
  };
  //

  const handleFileOpen = (file) => {
    console.log(`Opening file: ${file.name}`);
  };

  const handleError = (error, file) => {
    console.error(error);
  };

  const handleDownload = async (files) => {
    await downloadFile(files);
  };

  const handleCut = (files) => {
    console.log("Moving Files", files);
  };

  const handleCopy = (files) => {
    console.log("Copied Files", files);
  };

  const handleSelectionChange = (files) => {
    console.log("Selected Files", files);
  };

  let icons = new Map()
  // class, icon closed, icon open
  icons.set('namespace', [<FaRegSquare style={{size:18, marginRight:'2px'}}/>, <FaSquare style={{size:18, marginRight:'2px'}}/>])
  icons.set('pod', [<FaBox style={{size:18, marginRight:'2px'}}/>, <FaBoxOpen style={{size:18, marginRight:'2px'}}/>])
  icons.set('container', [<FaDocker style={{size:18, marginRight:'2px'}}/>, <FaDocker style={{size:18, marginRight:'2px'}}/>])

  const actions = new Map()

  actions.set('namespace', [
    {
      title: 'view namespace',
      icon: <FaJs />,
      onClick: (files) => {
        console.log('onclick view')
        console.log(files)
      }
    },
    {
      title: 'delete namespace',
      icon: <FaTshirt />,
      onClick: (files) => {
        console.log('onclick delete')
        console.log(files)
      }
    }

  ])
  actions.set('pod', [{
    title: 'restart',
    icon: <FaRebel/>,
    onClick: (files) => {
      console.log('onclick pods')
      console.log(files)
    }
  }])
  actions.set('container', [{
    title: 'shell',
    icon: <FaLinux/>,
    onClick: (files) => {
      console.log('onclick cont')
      console.log(files)
    }
  }])
  
  return (
    <div className="app">
      <div className="file-manager-container">
        <FileManager
          actions={actions}
          files={files}
          fileUploadConfig={fileUploadConfig}
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
          enableFilePreview
          maxFileSize={10485760}
          filePreviewPath={import.meta.env.VITE_API_FILES_BASE_URL}
          acceptedFileTypes=".txt, .png, .jpg, .jpeg, .pdf, .doc, .docx, .exe"
          height="100%"
          width="100%"
          initialPath={currentPath}
          onFolderChange={setCurrentPath}
        />
      </div>
    </div>
  );
}

export default App;
