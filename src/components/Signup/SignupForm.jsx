import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { boxShadow } from "../../styles/boxShadow";
import styled, { css } from "styled-components";
import theme from "../../styles/theme";
import LoadingLoader from "../UI/LoadingLoader";
import { Link } from "react-router-dom";

// 회원가입 유효성 검사 api : react hook form
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import GlobalButton from "../UI/GlobalButton";
import { signupEmail } from "../../store/slices/userSlice";
import userApis from "../../apis/userApis";
import { FcPrevious } from "react-icons/fc";

const SignupForm = (props) => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const dispatch = useDispatch();

  // 회원가입 유효성 검사
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("이메일 형식이 맞지 않습니다.")
      .required("이메일을 입력해주세요."),
    password: Yup.string()
      .min(1, "비밀번호는 7~10자 사이로 입력해주세요.")
      .max(15, "비밀번호는 7~15자 사이로 입력해주세요.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/,
        "대문자와 소문자 특수문자를 조합해주세요."
      )
      .required(),
    passwordCheck: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "비밀번호가 일치하지 않습니다. 다시 입력해주세요."
      )
      .required("비밀번호 확인란을 채워주세요."),
  });

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: yupResolver(schema),
  });

  const { ref, ...rest } = register("email");

  const onSubmitHandler = async (userData) => {
    console.log(checkEmail);
    if (!checkEmail) {
      alert("이메일 중복을 확인해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(signupEmail(userData)).unwrap();
      props.setCurrentPage(2);
    } catch (err) {
      return alert(err.message);
    }
  };

  const checkEmailHandler = async () => {
    const currentEmail = emailRef.current?.value;
    if (currentEmail) {
      try {
        const res = await userApis.signupEmailCheck(currentEmail);
        console.log(res, "중복체크 결과 ");
        setCheckEmail(true);
        return;
      } catch (err) {
        console.log(err, "중복체크 에러 ");
        setCheckEmail(false);
      }
    }
    console.log(checkEmail, "중복체크");
  };

  const previousPageHandler = () => {
    navigate("/signin");
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingLoader text="회원가입 처리중 입니다" />
      ) : (
        <>
          <div className="title">이메일 회원가입</div>
          <BoxContainer>
            <SignUpForm onSubmit={handleSubmit(onSubmitHandler)}>
              <PreviousIcon onClick={previousPageHandler} />
              <Label htmlFor="email">이메일</Label>
              <div>
                <Input
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  {...rest}
                  ref={(e) => {
                    ref(e);
                    emailRef.current = e;
                  }}
                />
                <button onClick={checkEmailHandler} className="checkEmailBtn">
                  중복확인
                </button>
              </div>
              <ErrorMSG>{errors.email?.message}</ErrorMSG>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                {...register("password")}
              />
              <ErrorMSG>{errors.password?.message}</ErrorMSG>

              <Label htmlFor="passwordCheck">비밀번호 확인</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                {...register("passwordCheck")}
              />
              <ErrorMSG>{errors.passwordCheck?.message}</ErrorMSG>
              <GlobalButton
                type="submit"
                _width="100%"
                margin="0 0 12px 0"
                background={theme.colors.main}
                hover={theme.colors.mainHover}
              >
                회원가입
              </GlobalButton>
            </SignUpForm>

            <Terms>
              <label>
                <input type="checkbox" />
                (필수) 서비스 이용 약관 동의
                <Link to="/">
                  <TermsShow>보기</TermsShow>
                </Link>
              </label>
            </Terms>
          </BoxContainer>{" "}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }) => {
    const { colors, device, fontSize, fontWeight } = theme;
    return css`
      margin: 158px auto;
      .title {
        text-align: center;
        margin-bottom: 32px;
        color: ${colors.grey90};
        font-weight: ${fontWeight.semiExtraBold};
      }
      font-size: ${fontSize["24"]};
      font-weight: ${fontWeight.semiExtraBold};

      ${device.mobile} {
        margin: 158px auto;
        width: 100%;

        font-size: ${fontSize["18"]};
      }
    `;
  }}
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 672px;
  height: 620px;

  & > div {
    padding: 0 7%;
    display: flex;
    flex-direction: column;
  }

  ${(props) => boxShadow()};

  ${({ theme }) => theme.device.mobile} {
    padding: 0 5%;

    width: 100%;
    height: 450px;
  }
`;

const SignUpForm = styled.form`
  ${({ theme }) => {
    const { colors, device, fontSize, fontWeight } = theme;
    return css`
      display: flex;
      flex-direction: column;
      width: 100%;

      padding: 0 7%;

      & > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .checkEmailBtn {
        display: inline-block;
        padding: 20px 0px;
        font-size: ${fontSize["16"]};
        color: ${colors.main};
        font-weight: ${fontWeight.semiBold};
        border: 1px solid #3771d3;
        width: 100px;
        height: 60px;
        border-radius: 8px;
        margin-left: 10px;
        white-space: nowrap;

        ${device.mobile} {
          height: 40px;
          padding: 10px 0px;
          font-size: ${fontSize["14"]};
          font-weight: ${fontWeight.regular};
        }
      }
    `;
  }}
`;

const Label = styled.label`
  ${({ theme }) => {
    const { colors, device, fontSize, fontWeight } = theme;
    return css`
      font-size: ${fontSize["14"]};
      color: ${colors.grey80};
      text-align: left;
    `;
  }}
`;

const Input = styled.input`
  ${({ theme }) => {
    const { colors, device, fontSize, fontWeight } = theme;
    return css`
      width: 100%;
      height: 60px;
      padding: 0.3em 1em;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      margin: 5px 0;

      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.placeHolder};

      ::placeholder {
        font-size: ${fontSize["14"]};
        color: ${colors.grey70};
        font-weight: lighter;
      }

      ${device.mobile} {
        height: 40px;
        ::placeholder {
          color: ${({ theme }) => theme.colors.placeHolder};
          font-size: ${({ theme }) => theme.calRem(12)};
        }
      }
    `;
  }}
`;
const ErrorMSG = styled.span`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSize["12"]};
  text-align: left;
  color: ${({ theme }) => theme.colors.errorMsg};
  margin-bottom: 16px;
`;

const Terms = styled.div`
  ${({ theme }) => {
    const { colors, device, fontSize, fontWeight } = theme;
    return css`
      font-size: ${fontSize["12"]};
      font-weight: ${fontWeight.semiExtraBold};
      margin-top: 10px;
      text-align: center;

      & > label > input[type="checkbox"] {
        margin-right: 5px;
        vertical-align: middle;
        position: relative;
        bottom: 1px;
      }
      ${device.mobile} {
        font-size: ${fontSize["12"]};
      }
    `;
  }}
`;

const TermsShow = styled.span`
  margin-left: 5px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.black};
  font-weight: ${({ theme }) => theme.fontWeight.semiExtraBold};
`;

const PreviousIcon = styled(FcPrevious)`
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
  & > polygon {
    fill: ${({ theme }) => theme.colors.darkGrey};
  }

  ${({ theme }) => theme.device.mobile} {
    margin-bottom: 20px;
  }
`;
export default SignupForm;
