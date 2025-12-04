import authService from "@/services/auth/auth.service";
import { setLogin } from "@/store/auth/AuthSlice";
import { setIsLoading, setShowMessage } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { LoginViewModelType } from "@/types/appUser/request";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();
  const [form] = Form.useForm();
  const loading = useSelector((state) => state.general.isLoading);
  const showMessage = useSelector((state) => state.general.showMessage);
  const [message, setMessage] = useState<string>("");

  const hideAuthMessage = () => {
    dispatch(setShowMessage(false));
  };
  const onLogin = async (loginForm: LoginViewModelType) => {
    dispatch(setIsLoading(true));
    try {
      const data = await authService.login(loginForm);
      if (data != null && data.status) {
        dispatch(setLogin(data));
        const redirectUrl = localStorage.getItem("redirect_url");
        if (redirectUrl) {
          route.push(redirectUrl);
          localStorage.removeItem("redirect_url");
        }
        // else if (data?.data?.user?.type == "Admin") {
        //   route.push("/dashboard");
        // }
        else {
          // route.push("/");
          route.push("/dashboard");

        }
      } else {
        setMessage(data.message || "Tài khoản hoặc mật khẩu không chính xác");
        dispatch(setShowMessage(true));
      }
      dispatch(setIsLoading(false));
    } catch (err) {
      setMessage("Tài khoản hoặc mật khẩu không chính xác");
      dispatch(setShowMessage(true));
      dispatch(setIsLoading(false));
    }
  };


  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => hideAuthMessage(), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <>
      {showMessage && <Alert type="error" showIcon message={message} />}

      <Form<LoginViewModelType>
        layout="vertical"
        name="login-form"
        form={form}
        onFinish={onLogin}
      >
        <Form.Item
          name="username"
          label="Tài khoản"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tài khoản đăng nhập",
            },
          ]}
        >
          <Input prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default LoginForm;
