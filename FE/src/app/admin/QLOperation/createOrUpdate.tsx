import {
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { DropdownOption } from "@/types/general";
import { fetchDropdown } from "@/utils/fetchDropdown";
import { OperationType } from "@/types/operation/dto";
import { OperationRequestType } from "@/types/operation/request";
import operationService from "@/services/operation/operation.service";
import moduleService from "@/services/module/module.service";
dayjs.locale("vi");

interface Props {
  moduleId: string;
  isOpen: boolean;
  operation?: OperationType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
  dropModules: DropdownOption[];
  setDropModules: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<OperationRequestType>["onFinish"] = async (
    formData: OperationRequestType
  ) => {
    try {
      if (props.operation) {
        const response = await operationService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa thao tác thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await operationService.create(formData);
        if (response.status) {
          toast.success("Tạo thao tác thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleMapEdit = () => {
    form.setFieldsValue(props.operation);
  };

  const handleSetDropdownModule = async () => {
    await Promise.all([
      fetchDropdown(
        props.dropModules,
        () => moduleService.getDropModule(""),
        props.setDropModules
      ),
    ]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    handleSetDropdownModule();
    setIsOpen(props.isOpen);
    if (props.operation) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.operation != null ? "Chỉnh sửa thao tác" : "Thêm mới thao tác"
      }
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      // initialValues={{ moduleId: props.moduleId.toUpperCase() }}
      >
        {props.operation && (
          <Form.Item<OperationRequestType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<OperationRequestType>
          name="moduleId"
          label="Tên chức năng"
          initialValue={props.moduleId}
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            placeholder="Chọn chức năng"
            options={props.dropModules.map((module) => ({
              ...module,
              value: module.value.toLowerCase(),
            }))}
            fieldNames={{ label: "label", value: "value" }}
          />
        </Form.Item>
        <Form.Item<OperationRequestType>
          label="Mã thao tác"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<OperationRequestType>
          label="Tên thao tác"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<OperationRequestType>
          label="Đường dẫn"
          name="uRL"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<OperationRequestType>
          label="Thứ tự"
          name="order"
          rules={[
            {
              type: "number",
              min: 0,
              message: "Giá trị phải lớn hơn hoặc bằng 0",
            },
          ]}
        >
          <InputNumber
            name="order"
            style={{ width: "100%" }}
            defaultValue={0}
            min={0}
          />
        </Form.Item>

        <Form.Item<OperationRequestType>
          label="Trạng thái"
          name="isShow"
          initialValue={true}
        >
          <Radio.Group>
            <Radio value={true}> Hiển thị </Radio>
            <Radio value={false}> Không hiển thị </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
