"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Dropdown,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Popconfirm,
  Pagination,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import withAuthorization from "@/libs/authentication";
import accountService, { IAccount, IAccountSearch } from "@/services/account/account.service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setIsLoading } from "@/store/general/GeneralSlice";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

const QLAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: any) => state.general.isLoading);
  
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IAccount | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const gameTypes = ["Valorant", "DeltaForce", "ValorantMobile"];
  const ranks = ["Bạc II", "Bạc III", "Vàng I", "Vàng II", "Vàng III"];
  const statuses = ["Available", "Sold", "Pending"];

  const fetchAccounts = async (
    pageIdx: number = pageIndex,
    pagesz: number = pageSize
  ) => {
    dispatch(setIsLoading(true));
    try {
      const response = await accountService.getData({
        pageIndex: pageIdx,
        pageSize: pagesz,
        searchText: searchText || undefined,
      });
      if (response.status) {
        setAccounts(response.data.items);
        setTotalCount(response.data.totalCount || 0);
      } else {
        toast.error("Lỗi lấy danh sách");
      }
    } catch (error) {
      toast.error("Lỗi lấy danh sách");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (account: IAccount) => {
    setEditingAccount(account);
    form.setFieldsValue(account);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingAccount) {
        const response = await accountService.update(editingAccount.id, values);
        if (response.status) {
          toast.success("Cập nhật thành công");
          fetchAccounts();
        }
      } else {
        const response = await accountService.create(values);
        if (response.status) {
          toast.success("Tạo thành công");
          fetchAccounts();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Lỗi lưu dữ liệu");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await accountService.delete(id);
      if (response.status) {
        toast.success("Xóa thành công");
        fetchAccounts();
      }
    } catch (error) {
      toast.error("Lỗi xóa");
    }
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await accountService.publish(id, !isPublished);
      if (response.status) {
        toast.success("Cập nhật trạng thái thành công");
        fetchAccounts();
      }
    } catch (error) {
      toast.error("Lỗi cập nhật");
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountCode",
      key: "accountCode",
    },
    {
      title: "Game",
      dataIndex: "gameType",
      key: "gameType",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Công khai",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean, record: IAccount) => (
        <Switch
          checked={isPublished}
          onChange={() => handlePublish(record.id, isPublished)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: IAccount) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AutoBreadcrumb />
      <Card style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Tìm kiếm mã tài khoản..."
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => fetchAccounts(1)}
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleCreate}
          >
            Thêm mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
        />

        <Pagination
          style={{ marginTop: 16, textAlign: "right" }}
          current={pageIndex}
          pageSize={pageSize}
          total={totalCount}
          onChange={(page) => {
            setPageIndex(page);
            fetchAccounts(page, pageSize);
          }}
          onShowSizeChange={(_, size) => {
            setPageSize(size);
            fetchAccounts(1, size);
          }}
        />
      </Card>

      <Modal
        title={editingAccount ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountCode"
            label="Mã tài khoản"
            rules={[{ required: true, message: "Vui lòng nhập mã tài khoản" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gameType"
            label="Loại game"
            rules={[{ required: true, message: "Vui lòng chọn loại game" }]}
          >
            <Select placeholder="Chọn game" options={gameTypes.map(g => ({ label: g, value: g }))} />
          </Form.Item>

          <Form.Item
            name="rank"
            label="Rank"
            rules={[{ required: true, message: "Vui lòng chọn rank" }]}
          >
            <Select placeholder="Chọn rank" options={ranks.map(r => ({ label: r, value: r }))} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn trạng thái" options={statuses.map(s => ({ label: s, value: s }))} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Link ảnh chính"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isPublished"
            label="Công khai"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAuthorization(QLAccount, "");
