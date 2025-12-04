import {
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  Radio,
  Select,
  TreeSelect,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchDropdown } from "@/utils/fetchDropdown";
import { DropdownOption, DropdownOptionTree } from "@/types/general";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc";
import AccountTypeConstant from "@/constants/AccountTypeConstant";
import { AppUserType } from "@/types/appUser/dto";
import { AspNetUsersRequestType } from "@/types/aspNetUsers/request";
import userService from "@/services/user/user.service";
import roleService from "@/services/role/role.service";
dayjs.extend(utc);
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  user?: AppUserType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
  dropVaiTros: DropdownOption[];
  departmentDropdown: DropdownOptionTree[];
  setDropVaiTros: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
  type?: string;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const handleOnFinish: FormProps<AspNetUsersRequestType>["onFinish"] = async (
    formData: AspNetUsersRequestType
  ) => {
    try {
      if (props.user) {
        const response = await userService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa tài khoản thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await userService.create(formData);
        if (response.status) {
          toast.success("Tạo tài khoản thành công");
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
    if (props.user) {
      form.setFieldsValue({
        ...props.user,
        ngaySinh: props.user.ngaySinh ? dayjs.utc(props.user.ngaySinh) : null,
      });
    }
  };

  const handleSetDropdownVaiTro = async () => {
    await Promise.all([
      fetchDropdown(
        props.dropVaiTros,
        () => roleService.getDropVaiTro(""),
        props.setDropVaiTros
      ),
    ]);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
    props.onClose();
  };

  useEffect(() => {
    // handleSetDropdownVaiTro();
    setIsOpen(props.isOpen);
    if (props.user) {
      handleMapEdit();
    } else {
      form.resetFields();
      form.setFieldValue("userName", "");
      form.setFieldValue("matKhau", "");
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={props.user != null ? "Chỉnh sửa tài khoản" : "Thêm mới tài khoản"}
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
        {props.user && (
          <Form.Item<AspNetUsersRequestType> name="id" hidden>
            <Input />
          </Form.Item>
        )}

        {!props.user && (
          <>
            <Form.Item<AspNetUsersRequestType>
              label="Tài khoản"
              name="userName"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: "Không được nhập chữ có dấu hoặc khoảng trắng!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<AspNetUsersRequestType>
              label="Mật khẩu"
              name="matKhau"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Form.Item<AspNetUsersRequestType>
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<AspNetUsersRequestType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập thông tin này!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="Vai trò"
          name="vaiTro"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn nhiều vai trò"
            options={props.dropVaiTros}
            fieldNames={{ label: "label", value: "value" }}
          />
        </Form.Item> */}
        <Form.Item<AspNetUsersRequestType>
          label="Điện thoại"
          name="phoneNumber"
          rules={[
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải có đúng 10 chữ số",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<AspNetUsersRequestType> label="Ngày sinh" name="ngaySinh">
          <DatePicker
            style={{ width: "100%" }}
            format={{
              format: "DD-MM-YYYY",
              type: "mask",
            }}
          />
        </Form.Item>
        <Form.Item<AspNetUsersRequestType>
          label="Giới tính"
          name="gender"
          initialValue="1"
        >
          <Radio.Group>
            <Radio value="1"> Nam </Radio>
            <Radio value="0"> Nữ </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<AspNetUsersRequestType> label="Địa chỉ" name="diaChi">
          <Input.TextArea />
        </Form.Item>

        {props.type === "" && (
          <Form.Item label="Loại tài khoản" name="type">
            <Select
              placeholder="Loại tài khoản"
              options={AccountTypeConstant.getDropdownList()}
              fieldNames={{ label: "label", value: "value" }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
