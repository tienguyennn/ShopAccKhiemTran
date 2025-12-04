import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Button, Image, message, Modal, Upload, UploadFile } from "antd";
import { UseFileUploaderOptions } from "./types";
import { useEffect, useState } from "react";
import fileServerService from "./fileServer.service";
import { UploadProps } from "antd/lib";
import { UseFileUploaderReturnType } from "./types";
import { getURL } from "next/dist/shared/lib/utils";
import { TaiLieuDinhKemType } from "@/types/taiLieuDinhKem/dto";

type FileUploaderProps = {
  controller: UseFileUploaderReturnType;
  readOnly?: boolean;
};

export interface UploadFileExtend extends UploadFile {
  isKySo?: boolean;
  id?: string;
}

function FileUploaderComponent({
  controller,
  readOnly = false,
}: FileUploaderProps) {
  const {
    maxCount,
    uploadType,
    listType,
    itemId,
    uploadFileList,
    customRequest,
    handlePreview,
    handleRemove,
    handleCheckFile,
    previewVisible,
    previewImage,
    handleCancel,
    handleDownload,
    beforeUpload,
  } = controller;
  console.log("uploadFileList ", uploadFileList);

  return (
    <>
      <Upload
        type={uploadType}
        listType={listType}
        fileList={uploadFileList}
        id={itemId}
        customRequest={readOnly ? undefined : customRequest}
        onPreview={handlePreview}
        multiple
        maxCount={maxCount}
        onRemove={readOnly ? undefined : handleRemove}
        showUploadList={{
          showRemoveIcon: !readOnly,
        }}
        disabled={readOnly}
        beforeUpload={beforeUpload}
        itemRender={(originNode, file: UploadFileExtend) => {
          const node = originNode as any;
          // Lấy children của originNode
          const children = node.props.children || [];
          const icon = children[0]; // icon paperclip
          const fileName = children[1]; // file name span
          const deleteAction = children[2]; // delete button
          const isError = file.status === "error";
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="ant-upload-list-item-actions"
                style={{ display: "flex", gap: 0 }}
              >
                {/* Preview button giống Delete */}
                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  className="ant-btn ant-btn-text ant-btn-color-default ant-btn-variant-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-action"
                  title="Xem trước tập tin"
                  onClick={() => handlePreview(file)}
                >
                  <span className="ant-btn-icon">
                    <EyeOutlined />
                  </span>
                </button>

                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  className="ant-btn ant-btn-text ant-btn-color-default ant-btn-variant-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-action"
                  title="Download tập tin"
                  onClick={() => handleDownload(file)}
                >
                  <span className="ant-btn-icon">
                    <DownloadOutlined />
                  </span>
                </button>

                {/* Delete (từ originNode) */}
                {!readOnly && deleteAction}
              </div>
            </div>
          );
        }}
      >
        {!readOnly &&
          (uploadFileList.length >= maxCount ? null : listType !== "text" &&
            listType !== "picture" ? (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">Upload</div>
            </div>
          ) : (
            <Button icon={<UploadOutlined />}>Upload</Button>
          ))}
      </Upload>
      {previewVisible && (
        <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
          <Image alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      )}
    </>
  );
}

function useFileUploader(
  options: UseFileUploaderOptions
): UseFileUploaderReturnType {
  const {
    maxCount = 2,
    initFiles = [],
    FileType,
    uploadType = "select",
    listType = "text",
    itemId,
    beforeUpload,
  } = options;
  const [files, setFiles] = useState<TaiLieuDinhKemType[]>(initFiles);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadFileList, setUploadFileList] = useState<UploadFileExtend[]>([]);

  useEffect(() => {
    setUploadFileList(
      (files || []).map((f, idx) => ({
        uid: f.duongDanFile + idx,
        name: f.tenTaiLieu,
        status: "done",
        url: f.duongDanFile,
        type: f.extension,
        isKySo: f.isKySo,
        id: f.id,
      }))
    );
  }, [files]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handlePreview = async (file: UploadFile) => {
    //console.log("ListType:", listType);
    const taiLieuDinhKem =
      getFiles()[getFiles().findIndex((f) => f.duongDanFile === file.url)];

    const fileUrl = fileServerService.getUrl(taiLieuDinhKem);
    console.log("🚀 ~ handlePreview ~ fileUrl:", fileUrl);
    if (!fileUrl) {
      // file.preview = await getBase64(fileUrl);
    }

    setPreviewImage(fileUrl || (file.preview as string));
    setPreviewVisible(true);

    //console.log("Preview = true");
  };

  const handleCheckFile = async (file: UploadFile) => {
    message.success("Đang kiểm tra file");
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleRemove = async (file: UploadFile) => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xoá file "${file.name}" không?`,
      okText: "Xoá",
      cancelText: "Huỷ",
      okType: "danger",
      onOk: async () => {
        // Xoá khỏi state
        setFiles((prev: TaiLieuDinhKemType[]) =>
          prev.filter((f: TaiLieuDinhKemType) => f.duongDanFile !== file.url)
        );

        // Xoá trên server
        try {
          await fileServerService.delete([file.uid]);
          message.success("Xoá file thành công");
        } catch (err) {
          console.error("Failed to delete file", err);
          message.error("Xoá file thất bại");
        }
      },
      onCancel() {
        // Không làm gì khi huỷ
      },
    });
  };
  const handleDownload = (file: UploadFile) => {
    //console.log("Thoong tin file:", file);
    const fileUrl = fileServerService.getUrl(file.uid, file.name);
    //console.log("File url", fileUrl);
    //console.log("File Name", name);

    window.open(fileUrl, "_blank");
  };
  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("Files", file);
    formData.append("FileType", FileType ?? "");
    formData.append("ItemId", itemId ?? "");
    try {
      const result = await fileServerService.upload(formData);
      if (
        result &&
        result.message === "Success" &&
        Array.isArray(result.data)
      ) {
        setFiles((prev: TaiLieuDinhKemType[]) => [...prev, ...result.data]);
        onSuccess?.(result);
      } else {
        onError?.(new Error("Upload failed"));
      }
    } catch (error) {
      console.log(error);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    }
  };

  const getFiles = () => files;
  const getFileIds = () => files.map((f) => f.id);
  const resetFiles = () => setFiles([]);

  const setFilesByItemId = async (itemId: string) => {
    try {
      const result = await fileServerService.getByItemId(itemId);
      console.log("🚀 ~ setFilesByItemId ~ result.data:", result.data);
      if (result && Array.isArray(result.data)) {
        setFiles(result.data);
      } else {
        setFiles([]);
      }
    } catch (error) {
      setFiles([]);
      console.error("Failed to fetch files by itemId", error);
    }
  };

  return {
    files,
    setFiles,
    getFiles,
    getFileIds,
    resetFiles,
    setFilesByItemId,
    maxCount,
    uploadType,
    listType,
    itemId,
    FileType,
    previewVisible,
    previewImage,
    uploadFileList,
    handlePreview,
    handleCheckFile,
    handleCancel,
    handleRemove,
    customRequest,
    handleDownload,
    beforeUpload,
  };
}

export { useFileUploader };

const FileUploader = Object.assign(FileUploaderComponent, {
  useFileUploader,
});

export default FileUploader;
