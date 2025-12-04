"use client";
import Flex from "@/components/shared-components/Flex";
import {
  DropdownOption,
  ResponsePageInfo,
  DropdownOptionTree,
} from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SignatureOutlined,
  UnlockOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
  UploadFile,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classes from "./page.module.css";
import Search from "./search";
import CreateOrUpdate from "./createOrUpdate";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EditUserRole from "./editUserRole";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import UserDetail from "./Detail";
import formatDate from "@/utils/formatDate";
import withAuthorization from "@/libs/authentication";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { AppUserType } from "@/types/appUser/dto";
import { AspNetUsersSearchType } from "@/types/aspNetUsers/request";
import userService from "@/services/user/user.service";
import departmentService from "@/services/department/department.service";

const QLNguoiDung: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listUsers, setListUsers] = useState<AppUserType[]>([]);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<AspNetUsersSearchType | null>(null);
  const [dropVaiTros, setDropVaiTros] = useState<DropdownOption[]>([]);
  const [dropDepartments, setDropDepartments] = useState<DropdownOption[]>([]);
  const [departmentDropdown, setDepartmentDropdown] = useState<
    DropdownOptionTree[]
  >([]);
  const searchParams = useSearchParams();

  const departmentId = searchParams?.get("departmentId") ?? undefined;
  const type = searchParams?.get("type") ?? "";

  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUserType | null>(null);
  const [currentDetailUser, setCurrentDetailUser] = useState<AppUserType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenEditUserRole, setIsOpenEditUserRole] = useState<boolean>(false);
  const [isOpenEditGroupUser, setIsOpenEditGroupUser] =
    useState<boolean>(false);
  const [isOpenEditChuKySo, setIsOpenEditChuKySo] = useState<boolean>(false);

  let tableColumns: TableProps<AppUserType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tài khoản",
      dataIndex: "userName",
      render: (_: any, record: AppUserType) => <span>{record.userName}</span>,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      width: "100px",
      render: (_: any, record: AppUserType) => {
        return (
          <>
            <p>{record.name}</p>
          </>
        );
      },
    },
    {
      title: "Nhóm quyền",
      dataIndex: "vaiTro_txt_response",
      width: "100px",
      render: (_: any, record: AppUserType) => {
        return (
          <>
            {record.vaiTro_txt_response != null &&
              record.vaiTro_txt_response.length > 0 &&
              record.vaiTro_txt_response.map((e, index) => (
                <Tag className="mb-1" color="cyan" key={index}>
                  {e}
                </Tag>
              ))}
          </>
        );
      },
    },
    {
      title: "Nhóm người sử dụng",
      dataIndex: "nhomNguoi_txt",
      width: "100px",
      render: (_: any, record: AppUserType) => {
        return (
          <>
            {record.nhomNguoi_txt != null &&
              record.nhomNguoi_txt.length > 0 &&
              record.nhomNguoi_txt.map((e, index) => (
                <Tag className="mb-1" color="cyan" key={index}>
                  {e}
                </Tag>
              ))}
          </>
        );
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "departmentId",
      render: (_: any, record: AppUserType) => (
        <span>{record.department_txt}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_: any, record: AppUserType) => <span>{record.email}</span>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      align: "center",
      render: (_: any, record: AppUserType) => (
        <span>{record.phoneNumber}</span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      align: "center",
      render: (_: any, record: AppUserType) => (
        <span>
          {record.ngaySinh ? formatDate(new Date(record.ngaySinh), true) : ""}
        </span>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (_: any, record: AppUserType) => (
        <span>{record.gioiTinh_txt}</span>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "diaChi",
      render: (_: any, record: AppUserType) => <span>{record.diaChi}</span>,
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: AppUserType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailUser(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Chỉnh sửa",
            key: "2",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            label: "Phân nhóm quyền",
            key: "editUserRole",
            icon: <UserAddOutlined />,
            onClick: () => {
              setCurrentDetailUser(record);
              setIsOpenEditUserRole(true);
            },
          },
          {
            label: "Phân nhóm người sử dụng",
            key: "editUserGroup",
            icon: <UsergroupAddOutlined />,
            onClick: () => {
              setCurrentDetailUser(record);
              setIsOpenEditGroupUser(true);
            },
          },
          {
            label: "Gán chữ ký số",
            key: "editChuKySo",
            icon: <SignatureOutlined />,
            onClick: () => {
              setCurrentDetailUser(record);
              setIsOpenEditChuKySo(true);
            },
          },
          {
            type: "divider",
          },
          {
            label: (
              <Popconfirm
                key={"Lock" + record.id}
                title={
                  record.lockoutEnabled ? "Xác nhận mở khóa" : "Xác nhận khóa"
                }
                description={
                  <span>
                    Bạn có muốn {record.lockoutEnabled ? "mở khóa" : "khóa"}{" "}
                    người dùng này không? <br /> Sau khi{" "}
                    {record.lockoutEnabled
                      ? "mở khóa người dùng có thể sử dụng hệ thống."
                      : "khóa sẽ không thể sử dụng hệ thống."}
                  </span>
                }
                okText={record.lockoutEnabled ? "Mở khóa ngay" : "Khóa ngay"}
                cancelText="Hủy"
                onConfirm={() => {
                  handleLockUser(
                    record.id || "",
                    record.lockoutEnabled || false
                  );
                }}
                trigger="click"
                forceRender
              >
                <span>{record.lockoutEnabled ? "Mở khóa" : "Khóa"}</span>
              </Popconfirm>
            ),
            key: "3",
            icon: record.lockoutEnabled ? <UnlockOutlined /> : <LockOutlined />,
            danger: true,
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "4",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpenPopconfirmId(record.id ?? ""),
          },
        ];
        return (
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button
                onClick={(e) => e.preventDefault()}
                color="primary"
                size="small"
              >
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteUser(record.id || "");
                setOpenPopconfirmId(null);
              }}
              onCancel={() => setOpenPopconfirmId(null)}
            ></Popconfirm>
          </>
        );
      },
    },
  ];

  if (type !== "") {
    tableColumns = [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: "Tài khoản",
        dataIndex: "userName",
        render: (_: any, record: AppUserType) => <span>{record.userName}</span>,
      },
      {
        title: "Họ tên",
        dataIndex: "fullName",
        width: "100px",
        render: (_: any, record: AppUserType) => {
          return (
            <>
              <p>{record.name}</p>
            </>
          );
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (_: any, record: AppUserType) => <span>{record.email}</span>,
      },
      {
        title: "Điện thoại",
        dataIndex: "phoneNumber",
        align: "center",
        render: (_: any, record: AppUserType) => (
          <span>{record.phoneNumber}</span>
        ),
      },
      {
        title: "Ngày sinh",
        dataIndex: "ngaySinh",
        align: "center",
        render: (_: any, record: AppUserType) => (
          <span>
            {record.ngaySinh ? formatDate(new Date(record.ngaySinh), true) : ""}
          </span>
        ),
      },
      {
        title: "Giới tính",
        dataIndex: "gioiTinh",
        render: (_: any, record: AppUserType) => (
          <span>{record.gioiTinh_txt}</span>
        ),
      },
      {
        title: "Địa chỉ",
        dataIndex: "diaChi",
        render: (_: any, record: AppUserType) => <span>{record.diaChi}</span>,
      },
      {
        title: "Thao tác",
        dataIndex: "actions",
        fixed: "right",
        render: (_: any, record: AppUserType) => {
          const items: MenuProps["items"] = [
            {
              label: "Chi tiết",
              key: "1",
              icon: <EyeOutlined />,
              onClick: () => {
                setCurrentDetailUser(record);
                setIsOpenDetail(true);
              },
            },
            {
              label: "Chỉnh sửa",
              key: "2",
              icon: <EditOutlined />,
              onClick: () => {
                handleShowModal(true, record);
              },
            },
            {
              type: "divider",
            },
            {
              label: (
                <Popconfirm
                  key={"Lock" + record.id}
                  title={
                    record.lockoutEnabled
                      ? "Xác nhận kích hoạt"
                      : "Xác nhận khóa"
                  }
                  description={
                    <span>
                      Bạn có muốn {record.lockoutEnabled ? "kích hoạt" : "khóa"}{" "}
                      người dùng này không? <br /> Sau khi{" "}
                      {record.lockoutEnabled
                        ? "kích hoạt người dùng có thể sử dụng hệ thống."
                        : "khóa sẽ không thể sử dụng hệ thống."}
                    </span>
                  }
                  okText={
                    record.lockoutEnabled ? "Kích hoạt ngay" : "Khóa ngay"
                  }
                  cancelText="Hủy"
                  onConfirm={() => {
                    handleLockUser(
                      record.id || "",
                      record.lockoutEnabled || false
                    );
                  }}
                  trigger="click"
                  forceRender
                >
                  <span>{record.lockoutEnabled ? "Kích hoạt" : "Khóa"}</span>
                </Popconfirm>
              ),
              key: "3",
              icon: record.lockoutEnabled ? (
                <UnlockOutlined />
              ) : (
                <LockOutlined />
              ),
              danger: true,
            },
            {
              type: "divider",
            },
            {
              label: "Xóa",
              key: "4",
              danger: true,
              icon: <DeleteOutlined />,
              onClick: () => setOpenPopconfirmId(record.id ?? ""),
            },
          ];
          return (
            <>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button
                  onClick={(e) => e.preventDefault()}
                  color="primary"
                  size="small"
                >
                  <Space>
                    Thao tác
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Popconfirm
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa?"
                okText="Xóa"
                cancelText="Hủy"
                open={openPopconfirmId === record.id}
                onConfirm={() => {
                  handleDeleteUser(record.id || "");
                  setOpenPopconfirmId(null);
                }}
                onCancel={() => setOpenPopconfirmId(null)}
              ></Popconfirm>
            </>
          );
        },
      },
    ];
  }

  const handleLockUser = async (id: string, isLock: boolean) => {
    let text = "Mở khóa";
    if (type !== "") {
      text = "Kích hoạt";
    }
    try {
      const response = await userService.lockUser(id);
      if (response.status) {
        toast.success(
          isLock ? `${text} tài khoản thành công` : "Khóa tài khoản thành công"
        );
        handleGetListNguoiDung();
      } else {
        toast.error(
          isLock ? `${text} tài khoản thất bại` : "Khóa tài khoản thất bại"
        );
      }
    } catch (error) {
      toast.error(
        isLock ? `${text} tài khoản thất bại` : "Khóa tài khoản thất bại"
      );
    }
  };

  const hanleCreateEditSuccess = () => {
    handleGetListNguoiDung();
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await userService.delete(id);
      if (response.status) {
        toast.success("Xóa tài khoản thành công");
        handleGetListNguoiDung();
      } else {
        toast.error("Xóa tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Xóa tài khoản thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<AspNetUsersSearchType>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListNguoiDung = useCallback(
    async (searchDataOverride?: AspNetUsersSearchType) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          departmentId,
          type,
          accessFailedCount: 0,
          emailConfirmed: null,
          lockoutEnabled: null,
          ...(searchValues || {}),
        };
        const response = await userService.getData(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListUsers(items);
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          });
        }
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    },
    [pageIndex, pageSize, type, departmentId, searchValues, dispatch]
  );

  const handleExport = async () => {
    const searchData: AspNetUsersSearchType = {
      pageIndex,
      pageSize,
      departmentId,
      type,
      ...(searchValues || {}),
    };
    const excelBase64 = await userService.exportExcel(searchData);
    downloadFileFromBase64(excelBase64.data, "Danh sách người dùng.xlsx");
  };
  const handleShowModal = (isEdit?: boolean, user?: AppUserType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentUser(user || null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentUser(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  const getDepartmentDropdown = async () => {
    try {
      const response = await departmentService.getDropdownListByUserDepartment(
        false
      );
      setDepartmentDropdown(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetListNguoiDung();
  }, [handleGetListNguoiDung]);

  useEffect(() => {
    getDepartmentDropdown();
  }, []);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div>
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
            className={classes.mgright5}
          >
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button>
          {type == "" && (
            <Link href="/QLNguoiDung/Import">
              <Button
                color="pink"
                variant="solid"
                icon={<VerticalAlignTopOutlined />}
                size="small"
                className={`${classes.mgright5} ${classes.colorKetXuat}`}
              >
                Import
              </Button>
            </Link>
          )}

          <Button
            onClick={() => {
              handleShowModal();
            }}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm mới
          </Button>
          <CreateOrUpdate
            isOpen={isOpenModal}
            dropVaiTros={dropVaiTros}
            setDropVaiTros={setDropVaiTros}
            departmentDropdown={departmentDropdown}
            onSuccess={hanleCreateEditSuccess}
            onClose={handleClose}
            user={currentUser}
            type={type}
          />
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          dropVaiTros={dropVaiTros}
          setDropVaiTros={setDropVaiTros}
          handleExport={handleExport}
          type={type}
        />
      )}
      <UserDetail
        user={currentDetailUser}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <EditUserRole
        user={currentDetailUser}
        isOpen={isOpenEditUserRole}
        onClose={() => setIsOpenEditUserRole(false)}
        onSuccess={hanleCreateEditSuccess}
        dropVaiTros={dropVaiTros}
        setDropVaiTros={setDropVaiTros}
        dropDepartments={dropDepartments}
        setDropDepartments={setDropDepartments}
      />

      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listUsers}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={dataPage?.totalCount}
          showTotal={(total, range) =>
            range[0] + "-" + range[1] + " trong " + total + " dữ liệu"
          }
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e);
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current);
            setPageSize(pageSize);
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  );
};

export default withAuthorization(QLNguoiDung, "QLNguoiDung");
