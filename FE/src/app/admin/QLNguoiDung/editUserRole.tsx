import {
  Drawer,
  Form,
  FormProps,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchDropdown } from "@/utils/fetchDropdown";
import { DropdownOption } from "@/types/general";
import { toast } from "react-toastify";
import classes from "./page.module.css";
import { debug } from "console";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { AppUserType } from "@/types/appUser/dto";
import { UserRoleRequestType } from "@/types/userRole/request";
import userRoleService from "@/services/userRole/userRole.service";
import roleService from "@/services/role/role.service";
import { DepartmentVMType } from "@/types/department/request";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  user?: AppUserType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
  dropVaiTros: DropdownOption[];
  setDropVaiTros: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
  dropDepartments: DropdownOption[];
  setDropDepartments: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
}

const EditUserRole: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [setupRole, setSetupRole] = useState<DropdownOption[]>();

  const handleOnFinish: FormProps<UserRoleRequestType>["onFinish"] = async (
    formData: UserRoleRequestType
  ) => {
    try {
      if (props.user) {
        formData.userId = props.user?.id ?? "";
        const response = await userRoleService.create(formData);
        if (response.status) {
          toast.success("Phân nhóm quyền thành công");
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

  const handleMapEdit = async () => {
    if (props.user && props.user.vaiTro) {
      form.setFieldsValue({
        roleCode: props.user.vaiTro,
      });
    }
  };

  const handleSetDropdownVaiTro = async () => {
    await Promise.all([
      fetchDropdown(
        props.dropVaiTros,
        () => roleService.getDropVaiTro(),
        props.setDropVaiTros
      ),
    ]);
  };

  const processDepartments = (departments: DepartmentVMType[], prefix = "") => {
    const optDrop: DropdownOption[] = [];

    departments.forEach((dept) => {
      optDrop.push({ label: `${prefix}${dept.name}`, value: dept.id });

      if (dept.departmentChilds && dept.departmentChilds?.length > 0) {
        optDrop.push(
          ...processDepartments(dept.departmentChilds, prefix + " ── ")
        );
      }
    });

    return optDrop;
  };

  const handleGetUserRoleByUserId = async () => {
    try {
      const response = await userRoleService.setupRole(props.user?.id ?? "");

      if (response.status) {
        const departmentOptions = processDepartments(
          response.data?.departments
        );

        setSetupRole(departmentOptions);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    handleSetDropdownVaiTro();
    if (props.user) {
      handleMapEdit();
      handleGetUserRoleByUserId();
    }
  }, [props.user]);

  return (
    <Modal
      title={"Phân nhóm quyền"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
    // width={600}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.user && (
          <Form.Item<UserRoleRequestType>
            name="userId"
            initialValue={props.user?.id}
            hidden
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item>
          <Typography.Text className={classes.userNameText}>
            Người dùng: <strong>{props.user?.name}</strong>
          </Typography.Text>
        </Form.Item>

        {/* <Form.Item<UserRoleRequestType>
          label="Phòng ban"
          name="deparmentId"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            placeholder="Chọn phòng ban"
            options={setupRole}
            fieldNames={{ label: "text", value: "value" }}
            onChange={(value) => handleChangRole(value)}
          />
        </Form.Item> */}
        <Form.Item<UserRoleRequestType> label="Chọn nhóm quyền" name="roleCode">
          <Select
            mode="multiple"
            placeholder="Chọn nhóm quyền người dùng"
            options={props.dropVaiTros}
            fieldNames={{ label: "label", value: "value" }}
            value={props.user?.vaiTro}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUserRole;
