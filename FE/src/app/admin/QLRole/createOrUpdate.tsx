import { Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { RoleType } from "@/types/role/dto";
import roleService from "@/services/role/role.service";
import { RoleRequestType } from "@/types/role/request";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  role?: RoleType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<RoleRequestType>["onFinish"] = async (
    formData: RoleRequestType
  ) => {
    try {
      if (props.role) {
        const response = await roleService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa nhóm quyền thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await roleService.create(formData);
        if (response.status) {
          toast.success("Tạo nhóm quyền thành công");
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
    form.setFieldsValue(props.role);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.role) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={props.role != null ? "Chỉnh sửa nhóm quyền" : "Thêm mới nhóm quyền"}
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
      >
        {props.role && (
          <Form.Item<RoleRequestType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<RoleRequestType>
          label="Mã nhóm quyền"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<RoleRequestType>
          label="Tên nhóm quyền"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
