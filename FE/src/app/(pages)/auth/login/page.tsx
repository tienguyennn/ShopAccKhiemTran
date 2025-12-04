"use client";
import LoginForm from "@/components/auth-components/LoginForm";
import { Card, Col, Image, Row } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import "./login.css";

const backgroundStyle = {
  backgroundImage: "url(/img/others/img-17.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect_url = params?.get("redirect_url") || "";

  React.useEffect(() => {
    localStorage.setItem("redirect_url", redirect_url || "");
  }, [redirect_url]);

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "-10%",
            marginBottom: "3.125rem", // Đẩy lên cao
          }}
        >
          <div style={{ width: "6.25rem" }}>
            <Image
              className="img-fluid"
              src="/img/image1329quoc-huy-viet-nam.png"
              alt="Logo"
              preview={false}
            />
          </div>
          <div
            style={{
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 25,
              textTransform: "uppercase",
              lineHeight: 1.5,
              marginLeft: ".625rem",
            }}
          >
            <div>{process.env.NEXT_PUBLIC_LOGO_TITLE}</div>
            <div>{process.env.NEXT_PUBLIC_HEADER_TITLE}</div>
          </div>
        </div>
        <Row justify="center">
          <Col xs={21} sm={21} md={21} lg={9}>
            <Card className="custom-card">
              <div className="my-4">
                {/* <div className="text-center">
                                    <Image
                                        className="img-fluid"
                                        src='/img/logo-header-gov-removebg-preview.png'
                                        alt="Logo"
                                        preview={false}
                                    />
                                    </div> */}
                <Row justify="center">
                  <p
                    style={{
                      color: "rgb(76 88 94)",
                      fontWeight: "bold",
                      fontSize: 25,
                      textTransform: "uppercase",
                      marginBottom: 0,
                    }}
                  >
                    Đăng nhập hệ thống
                  </p>
                </Row>
                <Row justify="center">
                  <div
                    style={{
                      width: "90%",
                      height: ".125rem",
                      backgroundColor: "rgba(76, 88, 94, 0.1)",
                      marginTop: ".625rem",
                    }}
                  ></div>
                </Row>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <LoginForm />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

const Login: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
