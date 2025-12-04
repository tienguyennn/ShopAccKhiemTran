import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";
import classes from "./page.module.css";
import {
  DownloadOutlined,
  SearchOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { useEffect } from "react";

import { fetchDropdown } from "@/utils/fetchDropdown";
import { DropdownOption } from "@/types/general";
import { AspNetUsersSearchType } from "@/types/aspNetUsers/request";
import roleService from "@/services/role/role.service";

interface SearchProps {
  onFinish: ((values: AspNetUsersSearchType) => void) | undefined;
  dropVaiTros: DropdownOption[];
  setDropVaiTros: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
  type?: string;
  handleExport: () => void;
}
const Search: React.FC<SearchProps> = ({
  onFinish,
  dropVaiTros,
  setDropVaiTros,
  type = "",
  handleExport,
}) => {
  useEffect(() => {
    const fetchAllDropdowns = async () => {
      await Promise.all([
        fetchDropdown(
          dropVaiTros,
          () => roleService.getDropdownId(),
          setDropVaiTros
        ),
      ]);
    };
    fetchAllDropdowns();
  }, [dropVaiTros, setDropVaiTros]);

  return (
    <>
      <Card className={classes.customCardShadow + classes.mgButton10}>
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<AspNetUsersSearchType> label="Họ tên" name="name">
                <Input placeholder="Họ tên" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<AspNetUsersSearchType> label="Tài khoản" name="userName">
                <Input placeholder="Tài khoản" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<AspNetUsersSearchType> label="Email" name="email">
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<AspNetUsersSearchType> label="Địa chỉ" name="diaChi">
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          {type == "" && (
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item<AspNetUsersSearchType> label="Vai trò" name="vaiTro">
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Vai trò"
                    fieldNames={{ label: "label", value: "value" }}
                    options={dropVaiTros}
                  >
                    <Select.Option value="All">All</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Flex alignItems="center" justifyContent="center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className={classes.mgright5}
              size="small"
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={handleExport}
              color="pink"
              variant="solid"
              icon={<DownloadOutlined />}
              className={`${classes.mgright5} ${classes.colorKetXuat}`}
              size="small"
            >
              Kết xuất
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;
